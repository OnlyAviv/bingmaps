import got from 'got';
import pbf from 'pbf';
import Place from './Place.js';
import { VectorTile } from '@mapbox/vector-tile';

export default class Tile {
    static async get(x, y, z) {
        const tileUrl = `https://t.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/${z}-${x}-${y}.mvt?it=G,LC,AP,L,LA&js=1&mvt=1&features=mvt,mvttxtmaxw,mvtfcall,mvtjustlabels&og=2359`;
        const response = await got(tileUrl, { responseType: 'buffer' });
        return new Tile(new VectorTile(new pbf(response.body)));
    }

    constructor(vectorTile) {
        this.landmarks = this._parseFeatures(vectorTile.layers.landmark, Landmark);
        this.roads = this._parseFeatures(vectorTile.layers.road, Road);
    }

    /**
     * @private
     */
    _parseFeatures(layer, FeatureClass) {
        return layer.map(feature => new FeatureClass(feature));
    }
}

class Landmark {
    constructor(feature) {
        this.id = `ypid:"${feature.properties['lmk-ypid']}"`;
        this.name = feature.properties.name;
        this.geometry = feature.loadGeometry(); // position will be this.geometry[0][0]
    }

    // Gets the place data
    async toPlace() {
        return await Place.fromLandmark(this);
    }
}

class Road {
    constructor(feature) {
        this.name = feature.properties.name;
        this.geometry = feature.loadGeometry(); // Roads have multiple segments, so this.geometry is an array of arrays.
    }
}
