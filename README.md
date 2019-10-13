ThreeJS GeoJSON Geometry
========================

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![Dependencies][dependencies-img]][dependencies-url]

A ThreeJS geometry class for stroking GeoJSON objects on a sphere. 

<p align="center">
  <a href="//vasturiano.github.io/three-geojson-geometry/example/countries/"><img width="80%" src="https://vasturiano.github.io/three-geojson-geometry/example/countries/preview.png"></a>
</p>

## Quick start

```
import { GeoJsonGeometry } from 'three-geojson-geometry';
```
or
```
const { GeoJsonGeometry } = require('three-geojson-geometry');
```
or even
```
<script src="//unpkg.com/three-geojson-geometry"></script>
```
then
```
const myLine = new THREE.Line(
    new THREE.GeoJsonGeometry(geoJson),
    new THREE.LineBasicMaterial({ color: 'blue' })
);

```

## API reference

### Constructor

<b>GeoJsonGeometry</b>(<b>geoJson</b>: <i>GeoJson object</i>, <b>radius</b>: <i>Float</i>, <b>resolution</b>: <i>Float</i>)

* <b>geoJson</b>: A GeoJson `geometry` object. It's recommended to split the geometries at the [anti-meridian](https://en.wikipedia.org/wiki/180th_meridian).
* <b>radius</b>: Radius of the sphere surface to draw the poygon on. Default is `1`.
* <b>resolution</b>: Resolution of the sphere, in lat/lng degrees. If the distance between two adjacent line points is larger than this value, the line segment will be interpolated in order to approximate the curvature of the sphere surface. Lower values yield more perfectly curved lines, at the cost of performance. Default is `5`.

### Properties

<b>.parameters</b>: <i>Object</i>

An object with a property for each of the constructor parameters. Any modification after instantiation does not change the geometry.

### Groups

When generating `Polygon` or `MultiPolygon` geometries, two groups are provided to which different materials can be applied.

* <b>0</b>: The outer ring of the polygon.
* <b>1</b>: The polygon inner holes (if any).

### Object types

Different geoJson types should be represented using different ThreeJS object types:
* `Point` and `MultiPoints` - Use `THREE.Points`
* `LineString` and `Polygon` - Use `THREE.Line`
* `MultiLineString` and `MultiPolygon` - Use `THREE.LineSegments`


[npm-img]: https://img.shields.io/npm/v/three-geojson-geometry.svg
[npm-url]: https://npmjs.org/package/three-geojson-geometry
[build-size-img]: https://img.shields.io/bundlephobia/minzip/three-geojson-geometry.svg
[build-size-url]: https://bundlephobia.com/result?p=three-geojson-geometry
[dependencies-img]: https://img.shields.io/david/vasturiano/three-geojson-geometry.svg
[dependencies-url]: https://david-dm.org/vasturiano/three-geojson-geometry
