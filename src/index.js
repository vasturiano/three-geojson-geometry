import {
  BufferGeometry,
  Float32BufferAttribute,
  Geometry
} from 'three';

const THREE = window.THREE
  ? window.THREE // Prefer consumption from global THREE, if exists
  : {
  BufferGeometry,
  Float32BufferAttribute,
  Geometry
};

import earcut from 'earcut';

import interpolateLine from './interpolateLine';

// support both modes for backwards threejs compatibility
const setAttributeFn = new THREE.BufferGeometry().setAttribute ? 'setAttribute' : 'addAttribute';

function GeoJsonGeometry(geoJson, radius = 1, resolution = 5) {
  THREE.BufferGeometry.call(this);

  this.type = 'GeoJsonGeometry';

  this.parameters = {
    geoJson,
    radius,
    resolution
  };

  // process various geometry types
  const groups = ({
    Point: genPoint,
    MultiPoint: genMultiPoint,
    LineString: genLineString,
    MultiLineString: genMultiLineString,
    Polygon: genPolygon,
    MultiPolygon: genMultiPolygon
  }[geoJson.type] || (() => []))(geoJson.coordinates, radius);

  // concat groups
  let indices = [], vertices = [];
  let groupCnt = 0;
  groups.forEach(newG => {
    const prevIndCnt = indices.length;
    concatGroup({ indices, vertices }, newG);

    this.addGroup(prevIndCnt, indices.length - prevIndCnt, groupCnt++);
  });

  // build geometry
  indices.length && this.setIndex(indices);
  vertices.length && this[setAttributeFn]('position', new THREE.Float32BufferAttribute(vertices, 3));

  //

  function genPoint(coords, r) {
    const vertices = polar2Cartesian(coords[1], coords[0], r);
    const indices = [];

    return [{ vertices, indices }];
  }

  function genMultiPoint(coords, r) {
    const result = { vertices: [], indices: [] };

    coords.map(c => genPoint(c, r)).forEach(([newPnt]) => {
      concatGroup(result, newPnt);
    });

    return [result];
  }

  function genLineString(coords, r) {
    const coords3d = interpolateLine(coords, resolution)
      .map(([lng, lat]) => polar2Cartesian(lat, lng, r));

    const { vertices } = earcut.flatten([coords3d]);

    const numPoints = Math.round(vertices.length / 3);

    const indices = [];

    for (let vIdx = 1; vIdx < numPoints; vIdx++) {
      indices.push(vIdx - 1, vIdx);
    }

    return [{ vertices, indices }];
  }

  function genMultiLineString(coords, r) {
    const result = { vertices: [], indices: [] };

    coords.map(c => genLineString(c, r)).forEach(([newLine]) => {
      concatGroup(result, newLine);
    });

    return [result];
  }

  function genPolygon(coords, r) {
    const coords3d = coords
      .map(coordsSegment => interpolateLine(coordsSegment, resolution)
        .map(([lng, lat]) => polar2Cartesian(lat, lng, r)));

    // Each point generates 3 vertice items (x,y,z).
    const { vertices, holes } = earcut.flatten(coords3d);

    const firstHoleIdx = holes[0] || Infinity;
    const outerVertices = vertices.slice(0, firstHoleIdx);
    const holeVertices = vertices.slice(firstHoleIdx);

    const holesIdx = new Set(holes);

    const numPoints = Math.round(vertices.length / 3);

    const outerIndices = [], holeIndices = [];
    for (let vIdx = 1; vIdx < numPoints; vIdx++) {
      if (!holesIdx.has(vIdx)) {
        if (vIdx < firstHoleIdx) {
          outerIndices.push(vIdx - 1, vIdx)
        } else {
          holeIndices.push(vIdx - 1 - firstHoleIdx, vIdx - firstHoleIdx);
        }
      }
    }

    const groups = [{ indices: outerIndices, vertices: outerVertices }];

    if (holes.length) {
      groups.push({ indices: holeIndices, vertices: holeVertices });
    }

    return groups;
  }

  function genMultiPolygon(coords, r) {
    const outer = { vertices: [], indices: [] };
    const holes = { vertices: [], indices: [] };

    coords.map(c => genPolygon(c, r)).forEach(([newOuter, newHoles]) => {
      concatGroup(outer, newOuter);
      newHoles && concatGroup(holes, newHoles);
    });

    const groups = [outer];
    holes.vertices.length && groups.push(holes);

    return groups;
  }
}

GeoJsonGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
GeoJsonGeometry.prototype.constructor = GeoJsonGeometry;

//

function concatGroup(main, extra) {
  const prevVertCnt = Math.round(main.vertices.length / 3);
  concatArr(main.vertices, extra.vertices);
  concatArr(main.indices, extra.indices.map(ind => ind + prevVertCnt));
}

function concatArr(target, src) {
  for (let e of src) target.push(e);
}

function polar2Cartesian(lat, lng, r = 0) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (90 - lng) * Math.PI / 180;
  return [
    r * Math.sin(phi) * Math.cos(theta), // x
    r * Math.cos(phi), // y
    r * Math.sin(phi) * Math.sin(theta) // z
  ];
}

export { GeoJsonGeometry };
