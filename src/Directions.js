import got from "got";
import { BasicAPIModule } from "./base.js";

export default class DirectionsAPIModule extends BasicAPIModule {
    async fromQuery([method, query]) {
        query.key = this.sessionKey;
        console.log(`https://dev.virtualearth.net/REST/v1/Routes/${method}?${new URLSearchParams(query).toString()}`);
        const response = await got(`https://dev.virtualearth.net/REST/v1/Routes/${method}?${new URLSearchParams(query).toString()}`, {
            headers: {
                "Referer": "https://www.bing.com/",
            },
            throwHttpErrors: false
        }).json();

        return response.resourceSets[0].resources.map(route => new Route(route));
    }

    async fromWaypoints(waypoints, method = 'recommended') {
        const queryBuilder = new DirectionalQueryBuilder();
        queryBuilder.method = method;
        waypoints.forEach(waypoint => queryBuilder.addWaypoint(waypoint));

        return await this.fromQuery(queryBuilder.build());
    }
}

class Route {
    constructor(data) {
        this.boundingBox = data.bbox;
        this.id = data.id;
        this.units = {
            distance: data.distanceUnit,
            duration: data.durationUnit,
            currency: data.currencyCode // if null, then no tolls
        }

        this.traffic = {
            congestion: data.trafficCongestion,
            dataUsed: data.trafficDataUsed,
        }

        this.distance = data.travelDistance; // in units.distance
        this.rawDuration = data.travelDuration;  // in units.time [without traffic]
        this.estDuration = data.travelDurationTraffic; // in units.time [with traffic]
        this.mode = data.travelMode;

        this.path = data.routeLegs.map(leg => new RouteLeg(leg));
    }
}

const latlng = ([latitude, longitude]) => ({ latitude, longitude });

class RouteLeg {
    constructor(data) {
        this.end = latlng(data.actualEnd.coordinates);
        this.start = latlng(data.actualStart.coordinates);

        this.description = data.description;

        this.endTime = Date.parse(data.endTime);
        
        this.path = data.itineraryItems.map(item => new PathNode(item));

        this.region = data.routeRegion;

        this.startTime = Date.parse(data.startTime);
        this.distance = data.travelDistance;
        this.duration = data.travelDuration;
        this.mode = data.travelMode;
    }
}

class PathNode {
    constructor(data) {
        this.direction = data.compassDirection;

        // details
        this.details = data.details.map(detail => ({
            angle: detail.compassDegrees,
            endPathIndices: detail.endPathIndices,
            type: detail.manueverType,
            names: detail.names,
            roadType: detail.roadType,
            startPathIndices: detail.startPathIndices,
        }));

        this.exit = data.exit;
        this.instruction = {
            text: data.instruction.text,
            type: data.instruction.maneuverType,
        }

        this.isRealTime = data.isRealTimeTransit;
        this.realTimeDelay = data.realTimeTransitDelay;

        this.location = latlng(data.maneuverPoint.coordinates);
        this.sideOfStreet = data.sideOfStreet;
        this.tollZone = data.tollZone;

        // transitTerminus?

        this.distance = data.travelDistance;
        this.duration = data.travelDuration;
        this.mode = data.travelMode;

    }
}

const MethodMap = new Map([
    ['recommended', 'alternate'],
    ['driving', 'driving'],
    ['transit', 'multimodal'],
    ['walking', 'walking']
]);

export class DirectionalQueryBuilder {
    constructor() {
        this._waypoints = [];
        this._units = 'mi';
        this._method = 'recommended';
        this._avoid = new Set(); // Only for driving
        this._tt = "departure";
        this._dt = undefined;
    }

    arriveBy(date) {
        this._tt = "arrival";
        this._setDateTime(date);

        return this;
    }

    departAt(date) {
        this._tt = "departure";
        this._setDateTime(date);

        return this;
    }

    _setDateTime(date) {
        // FIXME: Date formatting (XX/XX/XXXX XX:XX:XX)
        this._dt = date;

        return this;
    }

    set method(method) {
        if (MethodMap.has(method)) {
            this._method = method;
        } else {
            throw new Error('Invalid method: ' + method);
        }
    }

    get method() {
        return this._method;
    }

    get waypoints() {
        return this._waypoints;
    }

    set units(units) {
        if (units === 'mi' || units === 'km') {
            this._units = units;
        } else {
            throw new Error('Invalid unit of measurement: ' + units);
        }
    }

    get units() {
        return this._units;
    }

    addWaypoint(waypoint) {
        this._waypoints.push(waypoint);
        return this;
    }

    removeWaypoint(waypoint) {
        const waypointIndex = waypoint instanceof Waypoint
            ? this._waypoints.indexOf(waypoint)
            : typeof waypoint === 'number'
                ? waypoint
                : -1;

        if (waypointIndex !== -1) {
            this._waypoints.splice(waypointIndex, 1);
        } else {
            // TODO: Support Lat/Lng, Address, and Place, etc
            throw new Error('Invalid waypoint');
        }

        return this;
    }

    avoid(avoid) {
        const validAvoidances = ['highways', 'tolls', 'ferry', 'borderCrossing'];
        if (validAvoidances.includes(avoid)) {
            this._avoid.add(avoid);
        } else {
            throw new Error('Invalid avoidance: ' + avoid);
        }

        return this;
    }

    unAvoid(avoid) {
        if (this._avoid.has(avoid)) {
            this._avoid.delete(avoid);
        }

        return this;
    }

    build(numSolutions = 1) {
        this._validateWaypoints(numSolutions);

        const query = this._buildQueryObject(numSolutions);
        this._populateWaypoints(query);

        return [MethodMap.get(this._method), query];
    }

    _validateWaypoints(numSolutions) {
        if ((numSolutions > 1 || this._method === 'transit') && this._waypoints.length !== 2) {
            throw new Error('Invalid number of waypoints');
        }

        if (this._waypoints.length < 2 || this._waypoints.length > 25) {
            throw new Error('Invalid number of waypoints');
        }

        // if there are more than 2 waypoints, the method MUST be driving, or walking
        if (this._waypoints.length > 2 && this._method !== 'driving' && this._method !== 'walking') {
            throw new Error('Invalid number of waypoints');
        }
    }

    _buildQueryObject(numSolutions) {
        let query = {
            o: "json", // TODO: Do we need this?
            fi: true, // TODO: What is this?
            errorDetail: true, // TODO: What is this?
            ur: "us", // TODO: What is this?
            c: "en-US", // TODO: What is this?
            setfeatures: "routingfeat2", // TODO: What is this?
            ig: true, // TODO: What is this?
            ra: "routepath,routepathannotations,routeproperties,includeCameras,routeInfoCard,TransitFrequency", // TODO: What is this?
            lm: "driving,transit", // TODO: What is this?
            cn: "parkandrides", // TODO: What is this?
            avoid: Array.from(this._avoid).join(','),
            optmz: "timeWithTraffic", // TODO: What is this?
            trt: "1,3,6,8", // TODO: How does this work? (Its the preferred transit types)
            du: this._units,
            tt: this._tt,
            // dt: this._dt,
            maxSolns: numSolutions, // Amount of solutions to return
            rpo: "Points", // What is this?
        };

        if (this._dt) query.dt = this._dt;
        return query;
    }

    _populateWaypoints(query) {
        for (let i = 0; i < this._waypoints.length; i++) {
            const waypoint = this._waypoints[i];
            query[`wp.${i}`] = waypoint.toString();
        }
    }
}