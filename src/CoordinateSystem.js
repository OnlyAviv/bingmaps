// https://learn.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system

export default class CoordinateSystem {
    static EarthRadius = 6378137;
    static MinLatitude = -85.05112878;
    static MaxLatitude = 85.05112878;
    static MinLongitude = -180;
    static MaxLongitude = 180;

    static Clip(n, minValue, maxValue) {
        return Math.min(Math.max(n, minValue), maxValue);
    }

    static MapSize(levelOfDetail) {
        return 256 << levelOfDetail;
    }

    static GroundResolution(latitude, levelOfDetail) {
        latitude = this.Clip(latitude, this.MinLatitude, this.MaxLatitude);
        return Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * this.EarthRadius / this.MapSize(levelOfDetail);
    }

    static MapScale(latitude, levelOfDetail, screenDpi) {
        return this.GroundResolution(latitude, levelOfDetail) * screenDpi / 0.0254;
    }

    static LatLongToPixelXY(latitude, longitude, levelOfDetail) {
        latitude = this.Clip(latitude, this.MinLatitude, this.MaxLatitude);
        longitude = this.Clip(longitude, this.MinLongitude, this.MaxLongitude);

        let x = (longitude + 180) / 360;
        let sinLatitude = Math.sin(latitude * Math.PI / 180);
        let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);

        let mapSize = this.MapSize(levelOfDetail);
        let pixelX = Math.round(this.Clip(x * mapSize + 0.5, 0, mapSize - 1));
        let pixelY = Math.round(this.Clip(y * mapSize + 0.5, 0, mapSize - 1));

        return { pixelX, pixelY };
    }

    static PixelXYToLatLong(pixelX, pixelY, levelOfDetail) {
        let mapSize = this.MapSize(levelOfDetail);
        let x = (this.Clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
        let y = 0.5 - (this.Clip(pixelY, 0, mapSize - 1) / mapSize);

        let latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
        let longitude = 360 * x;

        return { latitude, longitude };
    }

    static PixelXYToTileXY(pixelX, pixelY) {
        let tileX = Math.floor(pixelX / 256);
        let tileY = Math.floor(pixelY / 256);

        return { tileX, tileY };
    }

    static TileXYToPixelXY(tileX, tileY) {
        let pixelX = tileX * 256;
        let pixelY = tileY * 256;

        return { pixelX, pixelY };
    }

    static TileXYToQuadKey(tileX, tileY, levelOfDetail) {
        let quadKey = '';
        for (let i = levelOfDetail; i > 0; i--) {
            let digit = '0';
            let mask = 1 << (i - 1);
            if ((tileX & mask) !== 0) {
                digit++;
            }
            if ((tileY & mask) !== 0) {
                digit++;
                digit++;
            }
            quadKey += digit;
        }
        return quadKey;
    }

    static QuadKeyToTileXY(quadKey) {
        let tileX = 0;
        let tileY = 0;
        let levelOfDetail = quadKey.length;

        for (let i = levelOfDetail; i > 0; i--) {
            let mask = 1 << (i - 1);
            switch (quadKey[levelOfDetail - i]) {
                case '0':
                    break;

                case '1':
                    tileX |= mask;
                    break;

                case '2':
                    tileY |= mask;
                    break;

                case '3':
                    tileX |= mask;
                    tileY |= mask;
                    break;

                default:
                    throw new Error("Invalid QuadKey digit sequence.");
            }
        }

        return { tileX, tileY, levelOfDetail };
    }
}