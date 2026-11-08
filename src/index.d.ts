import { BufferGeometry } from 'three';

type Position = number[];

export type GeoJson =
  | { type: 'Point'; coordinates: Position }
  | { type: 'MultiPoint'; coordinates: Position[] }
  | { type: 'LineString'; coordinates: Position[] }
  | { type: 'MultiLineString'; coordinates: Position[][] }
  | { type: 'Polygon'; coordinates: Position[][] }
  | { type: 'MultiPolygon'; coordinates: Position[][][] };

declare class GeoJsonGeometry extends BufferGeometry {
  constructor(
    geoJson: GeoJson,
    radius?: number,
    resolution?: number
  );

  parameters: {
    geoJson: GeoJson;
    radius: number;
    resolution: number;
  };
}

export default GeoJsonGeometry;
