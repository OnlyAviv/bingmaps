
# Coordinate System Documentation

The `CoordinateSystem` class in the Bing Maps API provides functionality for working with geographical coordinates, tiles, and related calculations. This documentation outlines the methods and properties available in the `CoordinateSystem` class.

## Class: `CoordinateSystem`

### Properties

#### `EarthRadius: number`

The average radius of the Earth in meters.

#### `MinLatitude: number`

The minimum valid latitude value.

#### `MaxLatitude: number`

The maximum valid latitude value.

#### `MinLongitude: number`

The minimum valid longitude value.

#### `MaxLongitude: number`

The maximum valid longitude value.

### Methods

#### `Clip(n: number, minValue: number, maxValue: number): number`

Clips a numeric value `n` to ensure it falls within the specified range `[minValue, maxValue]`. Returns the clipped value.

**Parameters:**

- `n` (number): The value to be clipped.
- `minValue` (number): The minimum allowed value.
- `maxValue` (number): The maximum allowed value.

**Example:**

```javascript
const clippedValue = CoordinateSystem.Clip(15, 0, 10);
// Returns 10 since 15 is clipped to the maximum value of 10
```

#### `MapSize(levelOfDetail: number): number`

Calculates the size of the map in pixels at a given level of detail.

**Parameters:**

- `levelOfDetail` (number): The level of detail (zoom level).

**Example:**

```javascript
const mapSize = CoordinateSystem.MapSize(10);
// Returns the map size in pixels at zoom level 10
```

#### `GroundResolution(latitude: number, levelOfDetail: number): number`

Calculates the ground resolution in meters per pixel at a specified latitude and level of detail.

**Parameters:**

- `latitude` (number): The latitude of the point.
- `levelOfDetail` (number): The level of detail (zoom level).

**Example:**

```javascript
const resolution = CoordinateSystem.GroundResolution(37.7749, 10);
// Returns the ground resolution in meters per pixel at latitude 37.7749 and zoom level 10
```

#### `MapScale(latitude: number, levelOfDetail: number, screenDpi: number): number`

Calculates the map scale at a specified latitude, level of detail, and screen DPI (dots per inch).

**Parameters:**

- `latitude` (number): The latitude of the point.
- `levelOfDetail` (number): The level of detail (zoom level).
- `screenDpi` (number): The screen dots per inch.

**Example:**

```javascript
const scale = CoordinateSystem.MapScale(37.7749, 10, 96);
// Returns the map scale at latitude 37.7749, zoom level 10, and screen DPI of 96
```

#### `LatLongToPixelXY(latitude: number, longitude: number, levelOfDetail: number): PixelXY`

Converts latitude and longitude coordinates to pixel XY coordinates at a specified level of detail.

**Parameters:**

- `latitude` (number): The latitude of the point.
- `longitude` (number): The longitude of the point.
- `levelOfDetail` (number): The level of detail (zoom level).

**Returns:**

- `PixelXY`: An object containing pixel X and Y coordinates.

**Example:**

```javascript
const pixelCoordinates = CoordinateSystem.LatLongToPixelXY(37.7749, -122.4194, 10);
// Returns an object { pixelX: ..., pixelY: ... }
```

#### `PixelXYToLatLong(pixelX: number, pixelY: number, levelOfDetail: number): LatLong`

Converts pixel XY coordinates to latitude and longitude coordinates at a specified level of detail.

**Parameters:**

- `pixelX` (number): The X coordinate in pixels.
- `pixelY` (number): The Y coordinate in pixels.
- `levelOfDetail` (number): The level of detail (zoom level).

**Returns:**

- `LatLong`: An object containing latitude and longitude coordinates.

**Example:**

```javascript
const coordinates = CoordinateSystem.PixelXYToLatLong(100, 150, 10);
// Returns an object { latitude: ..., longitude: ... }
```

#### `PixelXYToTileXY(pixelX: number, pixelY: number): TileXY`

Converts pixel XY coordinates to tile XY coordinates.

**Parameters:**

- `pixelX` (number): The X coordinate in pixels.
- `pixelY` (number): The Y coordinate in pixels.

**Returns:**

- `TileXY`: An object containing tile X and Y coordinates.

**Example:**

```javascript
const tileCoordinates = CoordinateSystem.PixelXYToTileXY(100, 150);
// Returns an object { tileX: ..., tileY: ... }
```

#### `TileXYToPixelXY(tileX: number, tileY: number): PixelXY`

Converts tile XY coordinates to pixel XY coordinates.

**Parameters:**

- `tileX` (number): The X coordinate of the tile.
- `tileY` (number): The Y coordinate of the tile.

**Returns:**

- `PixelXY`: An object containing pixel X and Y coordinates.

**Example:**

```javascript
const pixelCoordinates = CoordinateSystem.TileXYToPixelXY(3, 2);
// Returns an object { pixelX: ..., pixelY: ... }
```

#### `TileXYToQuadKey(tileX: number, tileY: number, levelOfDetail: number): string`

Converts tile XY coordinates and a level of detail to a QuadKey string.

**Parameters:**

- `tileX` (number): The X coordinate of the tile.
- `tileY` (number): The Y coordinate of the tile.
- `levelOfDetail` (number): The level of detail (zoom level).

**Returns:**

- `string`: The QuadKey string.

**Example:**

```javascript
const quadKey = CoordinateSystem.TileXYToQuadKey(3, 2, 10);
// Returns a QuadKey string
```

#### `QuadKeyToTileXY(quadKey: string): TileXY & { levelOfDetail: number }`

Converts a QuadKey string to tile XY coordinates and the corresponding level of detail.

**Parameters:**

- `quadKey` (string): The QuadKey string.

**Returns:**

- `TileXY & { levelOfDetail: number }`: An object containing tile X, Y coordinates, and the level of detail.

**Example:**

```javascript
const tileInfo = CoordinateSystem.QuadKeyToTileXY('3');
// Returns an object { tileX: ..., tileY: ..., levelOfDetail: ... }
```

## Type Definitions

### `PixelXY`

An object representing pixel XY coordinates.

```javascript
type PixelXY = { pixelX: number, pixelY: number };
```

### `LatLong`

An object representing latitude and longitude coordinates.

```javascript
type LatLong = { latitude: number, longitude: number };
```

### `TileXY`

An object representing tile XY coordinates.

```javascript
type TileXY = { tileX: number, tileY: number };
```

This documentation provides an overview of the methods and properties available in the `CoordinateSystem` class. For detailed usage examples, refer to the code snippets provided for each method.

---

# Directions API Documentation

The `DirectionsAPIModule` class in the Bing Maps API provides functionality for calculating routes and retrieving directions. This documentation outlines the methods and classes available in the `DirectionsAPIModule` for route calculations.

## Class: `DirectionsAPIModule`

### Methods

#### `fromQuery(query: [MappedMethod, DirectionalQueryObject]): Promise<Route[]>`

Calculates routes based on a query.

**Parameters:**

- `query` (`[MappedMethod, DirectionalQueryObject]`): An array containing the mapped method and the directional query object.

**Returns:**

- `Promise<Route[]>`: A promise that resolves to an array of routes.

**Example:**

```javascript
const directions = new DirectionsAPIModule();

const query = ['driving', { /* DirectionalQueryObject parameters */ }];
const routes = await directions.fromQuery(query);
```

#### `fromWaypoints(waypoints: string[], method: UnmappedMethod): Promise<Route[]>`

Calculates routes based on a list of waypoints and an unmapped method.

**Parameters:**

- `waypoints` (`string[]`): An array of waypoint locations.
- `method` (`UnmappedMethod`): The method for route calculation.

**Returns:**

- `Promise<Route[]>`: A promise that resolves to an array of routes.

**Example:**

```javascript
const directions = new DirectionsAPIModule();

const waypoints = ['47.6062100,-122.3320700', '45.523064,122.676483'];
const method = 'driving';

const routes = await directions.fromWaypoints(waypoints, method);
```

## Class: `Route`

Represents a calculated route.

### Properties

#### `boundingBox: BoundingBox`

The bounding box coordinates that encompass the entire route.

#### `id: string`

A unique identifier for the route.

#### `units: { distance: string, duration: string, currency: string | null }`

The units used for distance and duration, along with the currency information.

#### `traffic: { congestion: string, dataUsed: number }`

Information about traffic congestion and data usage.

#### `distance: number`

The total distance of the route.

#### `rawDuration: number`

The raw duration of the route without considering traffic conditions.

#### `estDuration: number`

The estimated duration of the route, considering traffic conditions.

#### `mode: string`

The mode of transportation (e.g., driving, walking).

#### `path: RouteLeg[]`

An array of route legs, each representing a segment of the overall route.

**Example:**

```javascript
const route = routes[0];
console.log(`Total Distance: ${route.distance} meters`);
console.log(`Estimated Duration: ${route.estDuration} seconds`);
console.log(`Mode of Transportation: ${route.mode}`);
```

## Class: `RouteLeg`

Represents a segment of a route.

### Properties

#### `end: LatLong`

The end coordinates of the route leg.

#### `start: LatLong`

The start coordinates of the route leg.

#### `description: string`

A description of the route leg.

#### `endTime: Date`

The end time of the route leg.

#### `startTime: Date`

The start time of the route leg.

#### `path: PathNode[]`

An array of path nodes representing detailed instructions for the route leg.

#### `region: string`

The region or area covered by the route leg.

#### `distance: number`

The distance of the route leg.

#### `duration: number`

The duration of the route leg.

#### `mode: string`

The mode of transportation for the route leg.

**Example:**

```javascript
const leg = route.path[0];
console.log(`Start Coordinates: ${leg.start.latitude}, ${leg.start.longitude}`);
console.log(`End Coordinates: ${leg.end.latitude}, ${leg.end.longitude}`);
console.log(`Description: ${leg.description}`);
```

## Class: `PathNode`

Represents a node along a route leg, providing detailed instructions.

### Properties

#### `direction: string`

The direction for the path node.

#### `details: { angle: number, endPathIndices: number[], type: string, names: string[], roadType: string, startPathIndices: number[] }[]`

Detailed information about the path node.

#### `exit: string`

The exit information for the path node.

#### `instruction: { text: string, type: string }`

The instruction for the path node.

#### `isRealTime: boolean`

Indicates whether real-time information is available for the path node.

#### `realTimeDelay: number`

The real-time delay for the path node.

#### `location: LatLong`

The geographical location of the path node.

#### `sideOfStreet: string`

The side of the street for the path node.

#### `tollZone: string`

The toll zone information for the path node.

#### `distance: number`

The distance associated with the path node.

#### `duration: number`

The duration associated with the path node.

#### `mode: string`

The mode of transportation associated with the path node.

**Example:**

```javascript
const node = leg.path[0];
console.log(`Direction: ${node.direction}`);
console.log(`Instruction: ${node.instruction.text}`);
console.log(`Location: ${node.location.latitude}, ${node.location.longitude}`);
```

## Type Definitions

### `MappedMethod`

A type representing mapped route calculation methods.

```javascript
type MappedMethod = 'alternate' | 'driving' | 'multimodal' | 'walking';
```

### `UnmappedMethod`

A type representing unmapped route calculation methods.

```javascript
type UnmappedMethod = 'recommended' | 'driving' | 'transit' | 'walking';
```

### `Unit`

A type representing units of measurement.

```javascript
type Unit = 'km' | 'mi';
```

### `TimeType`

A type representing time-related options.

```javascript
type TimeType = 'arrival' | 'departure';
```

### `BoundingBox`

A type representing a bounding box defined by four coordinates.

```javascript
type BoundingBox = [number, number, number, number];
```

### `DirectionalQueryObject`

An object containing parameters for a directional query.

```javascript
type DirectionalQueryObject = {
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
};
```

This documentation provides an overview of the methods, properties, and types available in the `DirectionsAPIModule` class for route calculations. For detailed usage examples, refer to the code snippets provided for each method and class.

---

# DirectionalQueryBuilder Documentation

The `DirectionalQueryBuilder` class in the Bing Maps API provides functionality for constructing directional queries to be used with the `DirectionsAPIModule`. This documentation outlines the methods and properties available in the `DirectionalQueryBuilder` class.

## Class: `DirectionalQueryBuilder`

### Properties

#### `waypoints: string[]`

An array of waypoints representing locations in the route.

#### `method: UnmappedMethod`

The method for route calculation.

#### `units: Unit`

The units of measurement for distance.

### Methods

#### `arriveBy(date: string): this`

Specifies the arrival date and time for the route.

**Parameters:**

- `date` (string): The arrival date and time in the format 'YYYY-MM-DDTHH:mm:ss'.

**Returns:**

- `this`: The current instance of `DirectionalQueryBuilder`.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.arriveBy('01/01/2023 12:00:00');
```

#### `departAt(date: string): this`

Specifies the departure date and time for the route.

**Parameters:**

- `date` (string): The departure date and time in the format 'YYYY-MM-DDTHH:mm:ss'.

**Returns:**

- `this`: The current instance of `DirectionalQueryBuilder`.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.departAt('01/01/2023 12:00:00');
```

#### `set method(method: UnmappedMethod): void`

Sets the method for route calculation.

**Parameters:**

- `method` (UnmappedMethod): The method for route calculation.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.method = 'driving';
```

#### `get method(): UnmappedMethod`

Gets the current method for route calculation.

**Returns:**

- `UnmappedMethod`: The current method for route calculation.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
console.log(queryBuilder.method); // Output: undefined

queryBuilder.method = 'driving';
console.log(queryBuilder.method); // Output: 'driving'
```

#### `addWaypoint(waypoint: string): this`

Adds a waypoint to the list of waypoints.

**Parameters:**

- `waypoint` (string): The waypoint to be added.

**Returns:**

- `this`: The current instance of `DirectionalQueryBuilder`.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.addWaypoint('47.6062100,-122.3320700');
```

#### `removeWaypoint(waypoint: string): this`

Removes a waypoint from the list of waypoints.

**Parameters:**

- `waypoint` (string): The waypoint to be removed.

**Returns:**

- `this`: The current instance of `DirectionalQueryBuilder`.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.addWaypoint('47.6062100,-122.3320700');
queryBuilder.removeWaypoint('47.6062100,-122.3320700');
```

#### `avoid(avoid: string): this`

Specifies a feature to avoid during route calculation.

**Parameters:**

- `avoid` (string): The feature to avoid.

**Returns:**

- `this`: The current instance of `DirectionalQueryBuilder`.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.avoid('tolls');
```

#### `unAvoid(avoid: string): this`

Removes a feature from the list of features to avoid during route calculation.

**Parameters:**

- `avoid` (string): The feature to be removed from avoidance.

**Returns:**

- `this`: The current instance of `DirectionalQueryBuilder`.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.avoid('tolls');
queryBuilder.unAvoid('tolls');
```

#### `build(numSolutions?: number): [MappedMethod, DirectionalQueryObject]`

Builds and returns a directional query object based on the current state of the builder.

**Parameters:**

- `numSolutions` (number): The number of solutions to request (optional).

**Returns:**

- `[MappedMethod, DirectionalQueryObject]`: An array containing the mapped method and the directional query object.

**Example:**

```javascript
const queryBuilder = new DirectionalQueryBuilder();
queryBuilder.addWaypoint('47.6062100,-122.3320700');
queryBuilder.addWaypoint('45.523064,122.676483');
queryBuilder.method = 'driving';

const query = queryBuilder.build();
// query is now ['driving', { /* DirectionalQueryObject parameters */ }]
```

This documentation provides an overview of the methods and properties available in the `DirectionalQueryBuilder` class. For detailed usage examples, refer to the code snippets provided for each method.

---

# Place API Documentation

The `Place` class in the Bing Maps API provides functionality for retrieving information about a location, including details such as name, address, and reviews. This documentation outlines the methods and properties available in the `Place` class.

## Class: `Place`

### Static Methods

#### `fromLandmark(landmark: Landmark): Promise<Place>`

Searches for a place based on a landmark.

**Parameters:**

- `landmark` (Landmark): The landmark.

**Returns:**

- `Promise<Place>`: A promise that resolves to a `Place` object.

**Example:**

```javascript
const place = await Place.fromLandmark(...);
```

#### `fromFilter(filter: string): Promise<Place>`

Searches for a place based on a filter.

**Parameters:**

- `filter` (string): The filter to apply.
> [!TIP]
> The filter is a string that follows no specific schema, so pass the ID of the landmark you want to search for. (`myLandmark.id`)

**Returns:**

- `Promise<Place>`: A promise that resolves to a `Place` object.

**Example:**

```javascript
const place = await Place.fromFilter(myLandmark.id);
```

#### `fromQuery(query: string): Promise<Place>`

Searches for a place based on a query.

**Parameters:**

- `query` (string): The query string.

**Returns:**

- `Promise<Place>`: A promise that resolves to a `Place` object.

**Example:**

```javascript
const place = await Place.fromQuery('Space Needle, 400 Broad St, Seattle, WA, United States');
```

#### `fromResponse(response: string): Place`
> [!WARNING]
> This method is intended for internal use only. It is exposed if you know what you are doing, but it is not recommended to use this method directly.

Creates a `Place` object from a response string.

**Parameters:**

- `response` (string): The response string.

**Returns:**

- `Place`: A `Place` object.

**Example:**

```javascript
const place = Place.fromResponse(...);
```

### Constructor

#### `constructor(rawData: Object)`
> [!WARNING]
> This method is intended for internal use only. It is exposed if you know what you are doing, but it is not recommended to use this method directly.

Creates a `Place` object from raw data.

**Parameters:**

- `rawData` (Object): The raw data object.

**Example:**

```javascript
const rawData = { name: 'Space Needle', location: {...}, ... };
const place = new Place(rawData);
```

### Instance Properties

#### `type: string`

The type of place (e.g., "Point of Interest").

#### `bounds: BoundingBox`

The bounding box coordinates that encompass the place.

#### `location: LatLong`

The geographical location of the place.

#### `name: string`

The name of the place.

#### `thumbnail: string`

A URL to a thumbnail image representing the place.

#### `category: string | undefined`

The category of the place (e.g., "Restaurant"). Undefined if not available.

#### `website: string | undefined`

The website URL of the place. Undefined if not available.

#### `localizationLang?: string`

The language code used for localization.

#### `address?: Address`

The address information for the place.

#### `openHours?: OpenHours[]`

An array of objects representing the open hours for the place.

#### `phone?: string`

The phone number of the place.

#### `rating?: { score: number, count: number, provider: string } | undefined`

The rating information for the place. Undefined if not available.

#### `price?: string`

The price information for the place.

#### `categories?: string[]`

An array of categories associated with the place.

#### `reviews?: Review[]`

An array of reviews for the place.

### Type Definitions

#### `OpenHours`

Represents the open hours for a day.

```javascript
type OpenHours = {
    day: string,
    hoursRanges: { start: string, end: string }[],
};
```

#### `Review`

Represents a review for a place.

```javascript
type Review = {
    text: string,
    score: number,
    author: string,
    date: Date,
    link: string,
    provider: string,
};
```

#### `Address`

Represents the address information for a place.

```javascript
type Address = {
    addressLine: string;
    city: string;
    stateMunicipality: string;
    country: string;
    postalCode: string;
    neighborhood: string;
    formattedAddress: string;
};
```

This documentation provides an overview of the methods, properties, and types available in the `Place` class. For detailed usage examples, refer to the code snippets provided for each method and property.

---

# Tile API Documentation

The `Tile` class in the Bing Maps API provides functionality for retrieving vector tiles containing information about landmarks and roads. This documentation outlines the methods and properties available in the `Tile` class.

## Class: `Tile`

### Static Methods

#### `get(x: number, y: number, z: number): Promise<Tile>`

Retrieves a vector tile based on the tile coordinates (x, y, z).

**Parameters:**

- `x` (number): The X coordinate of the tile.
- `y` (number): The Y coordinate of the tile.
- `z` (number): The zoom level of the tile.

**Returns:**

- `Promise<Tile>`: A promise that resolves to a `Tile` object.

**Example:**

```javascript
const tile = await Tile.get(3, 2, 10);
```

### Constructor

#### `constructor(vectorTile: any)`
> [!WARNING]
> This method is intended for internal use only. It is exposed if you know what you are doing, but it is not recommended to use this method directly.

Creates a `Tile` object from raw vector tile data.

**Parameters:**

- `vectorTile` (any): The raw vector tile data.

**Example:**

```javascript
const vectorTileData = {...}; // Raw vector tile data
const tile = new Tile(vectorTileData);
```

### Instance Properties

#### `landmarks: Landmark[]`

An array of `Landmark` objects representing landmarks on the tile.

#### `roads: Road[]`

An array of `Road` objects representing roads on the tile.

### Type Definitions

#### `XY`

An object representing X and Y coordinates.

```javascript
type XY = { x: number, y: number };
```

#### `Landmark`

Represents a landmark on a vector tile.

```javascript
class Landmark {
    toPlace(): Promise<Place>;
    readonly id: string;
    readonly name: string;
    readonly geometry: XY[][];
}
```

#### `Road`

Represents a road on a vector tile.

```javascript
class Road {
    readonly id: string;
    readonly geometry: XY[][];
}
```

This documentation provides an overview of the methods, properties, and types available in the `Tile` class. For detailed usage examples, refer to the code snippets provided for each method and property.