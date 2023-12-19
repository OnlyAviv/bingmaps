import CoordinateSystem from './CoordinateSystem.js'
import DirectionsAPIModule, { DirectionalQueryBuilder } from './Directions.js'
import Place from './Place.js'
import Tile from './Tile.js'
import * as Cheerio from "cheerio";
import got from "got";


export default class BingMapsAPI {
    static async instantiate(apiKey = false) {
        const response = await got("https://www.bing.com/maps");
        const $ = Cheerio.load(response.body);
        // get all the script tags without a src attribute
        const scripts = $("script:not([src])");
        // get the script tag with the mapControlViewData object
        const dataHTML = scripts.filter((i, e) => {
            return $(e).html().startsWith("var mapControlViewData");
        }).html();

        // parse the data
        const data = JSON.parse(dataHTML.substring(dataHTML.indexOf("{"), dataHTML.lastIndexOf("}") + 1));

        return new this(apiKey || data.globalConfigs.dynamicProperties.sessionKey, data.globalConfigs.dynamicProperties.appId)
    }

    /**
     * @private
     */
    constructor(sessionKey, appID) {
        this.appID = appID;
        this.sessionKey = sessionKey;

        this.CoordinateSystem = CoordinateSystem;
        this.Directions = new DirectionsAPIModule(appID, sessionKey); // Needs keys, so we can't just export the class
        this.DirectionalQueryBuilder = DirectionalQueryBuilder;
        this.Place = Place;
        this.Tile = Tile;
    }
}