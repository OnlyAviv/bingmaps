declare class BingMapsAPI {
    static instantiate(apiKey?: string): Promise<BingMapsAPI>;
    constructor(apiKey?: string);

    readonly appID: string;
    readonly sessionKey: string;
    readonly CoordinateSystem: typeof CoordinateSystem;
    readonly Directions: DirectionsAPIModule;
    readonly DirectionalQueryBuilder: typeof DirectionalQueryBuilder;
    readonly Place: typeof Place;
    readonly Tile: typeof Tile;
}

export default BingMapsAPI;

declare class CoordinateSystem {
    static readonly EarthRadius: number;
    static readonly MinLatitude: number;
    static readonly MaxLatitude: number;
    static readonly MinLongitude: number;
    static readonly MaxLongitude: number;

    static Clip(n: number, minValue: number, maxValue: number): number;
    static MapSize(levelOfDetail: number): number;
    static GroundResolution(latitude: number, levelOfDetail: number): number;
    static MapScale(latitude: number, levelOfDetail: number, screenDpi: number): number;
    static LatLongToPixelXY(latitude: number, longitude: number, levelOfDetail: number): PixelXY;
    static PixelXYToLatLong(pixelX: number, pixelY: number, levelOfDetail: number): LatLong;
    static PixelXYToTileXY(pixelX: number, pixelY: number): TileXY;
    static TileXYToPixelXY(tileX: number, tileY: number): PixelXY;
    static TileXYToQuadKey(tileX: number, tileY: number, levelOfDetail: number): string;
    static QuadKeyToTileXY(quadKey: string): TileXY & { levelOfDetail: number };
}

declare type PixelXY = { pixelX: number, pixelY: number };
declare type LatLong = { latitude: number, longitude: number };
declare type TileXY = { tileX: number, tileY: number };


// ==================================================================================================== //


declare class DirectionsAPIModule {
    fromQuery(query: [MappedMethod, DirectionalQueryObject]): Promise<Route[]>;
    fromWaypoints(waypoints: string[], method: UnmappedMethod): Promise<Route[]>;
}

declare class Route {
    readonly boundingBox: BoundingBox;
    readonly id: string;
    readonly units: { distance: string, duration: string, currency: string | null };
    readonly traffic: { congestion: string, dataUsed: number };
    readonly distance: number;
    readonly rawDuration: number;
    readonly estDuration: number;
    readonly mode: string;
    readonly path: RouteLeg[];
}

declare class RouteLeg {
    readonly end: LatLong;
    readonly start: LatLong;
    readonly description: string;
    readonly endTime: Date;
    readonly startTime: Date;
    readonly path: PathNode[];
    readonly region: string;
    readonly distance: number;
    readonly duration: number;
    readonly mode: string;
}

declare class PathNode {
    readonly direction: string;
    readonly details: {
        angle: number,
        endPathIndices: number[],
        type: string,
        names: string[],
        roadType: string,
        startPathIndices: number[],
    }[];
    readonly exit: string;
    readonly instruction: {
        text: string,
        type: string,
    }
    readonly isRealTime: boolean;
    readonly realTimeDelay: number;
    readonly location: LatLong;
    readonly sideOfStreet: string;
    readonly tollZone: string;
    readonly distance: number;
    readonly duration: number;
    readonly mode: string;
}

declare type MappedMethod = 'alternate' | 'driving' | 'multimodal' | 'walking'
declare type UnmappedMethod = 'recommended' | 'driving' | 'transit' | 'walking'
declare type Unit = 'km' | 'mi';
declare type TimeType = 'arrival' | 'departure';
declare type BoundingBox = [number, number, number, number];

declare class DirectionalQueryBuilder {
    private readonly _waypoints: string[];
    private readonly _units: Unit;
    private readonly _method: UnmappedMethod;
    private readonly _avoid: Set<string>;
    private readonly _tt: TimeType;
    private readonly _dt: Date | undefined;

    arriveBy(date: string): this;
    departAt(date: string): this;
    private _setDateTime(date: string): this;

    set method(method: UnmappedMethod);
    get method(): UnmappedMethod;

    get waypoints(): string[];
    
    set units(unit: Unit);
    get units(): Unit;

    addWaypoint(waypoint: string): this;
    removeWaypoint(waypoint: string): this;
    avoid(avoid: string): this;
    unAvoid(avoid: string): this;
    build(numSolutions?: number): [MappedMethod, DirectionalQueryObject];

    private _validWaypoints(numSolutions: number): void;
    private _buildQuery(numSolutions: number): DirectionalQueryObject;
    private _populateWaypoints(query: DirectionalQueryObject): void;
}

declare type DirectionalQueryObject = {
    o: string,
    fi: boolean,
    errorDetail: boolean,
    ur: string,
    c: string,
    setfeatures: string,
    ig: boolean,
    ra: string,
    lm: string,
    cn: string,
    avoid: string,
    optmz: string,
    trt: string,
    du: Unit,
    tt: TimeType,
    dt?: string | undefined,
    maxSolns: number,
    rpo: string,
}


// ==================================================================================================== //


declare class Place {
    static fromLandmark(landmark: string): Promise<Place>;
    static fromFilter(filter: string): Promise<Place>;
    static fromQuery(query: string): Promise<Place>;
    static fromResponse(response: string): Place;

    private constructor(rawData: Object);
    private _parseEntity(entity: Object): void;
    private _parseFacts(facts: Object): void;
    private _parseItineraryFacts(itineraryFacts: Object): void;
    private _parseReviews(reviews: Object): void;
    private static _extractDataFromContainer(container: any, data: any): void;
    private static _extractReviews(container: any, data: any): void;

    readonly type: string;
    readonly bounds: BoundingBox;
    readonly location: LatLong;
    readonly name: string;
    readonly thumbnail: string;
    readonly category: string | undefined;
    readonly website: string | undefined;

    readonly localizationLang?: string;
    readonly address?: Address;
    readonly openHours?: OpenHours[];

    readonly phone?: string;
    readonly rating?: { score: number, count: number, provider: string } | undefined;
    readonly price?: string;
    readonly categories?: string[];

    readonly reviews?: Review[];
}

declare type OpenHours = {
    day: string,
    hoursRanges: { start: string, end: string }[],
}

declare type Review = {
    text: string,
    score: number,
    author: string,
    date: Date,
    link: string,
    provider: string,
}

declare type Address = {
    addressLine: string;
    city: string;
    stateMunicipality: string;
    country: string;
    postalCode: string;
    neighborhood: string;
    formattedAddress: string;
}


// ==================================================================================================== //

declare class Tile {
    static get(x: number, y: number, z: number): Promise<Tile>;
    private constructor(vectorTile: any);
    private _parseFeatures(layer: any, features: any): void;

    readonly landmarks: Landmark[];
    readonly roads: Road[];
}

declare type XY = { x: number, y: number };

declare class Landmark {
    toPlace(): Promise<Place>;
    readonly id: string;
    readonly name: string;
    readonly geometry: XY[][];
}

declare class Road {
    readonly id: string;
    readonly geometry: XY[][];
}