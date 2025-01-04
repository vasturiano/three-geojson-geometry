import { geoDistance, geoInterpolate } from 'd3-geo';
import { interpolateNumber } from 'd3-interpolate';

const interpolateLine = (lineCoords = [], maxDegDistance = 1) => {
  const result = [];

  let prevPnt = null;
  lineCoords.forEach(pnt => {
    if (prevPnt) {
      const dist = geoDistance(pnt, prevPnt) * 180 / Math.PI;
      if (dist > maxDegDistance) {
        const geoInterpol = geoInterpolate(prevPnt, pnt);
        const altInterpol = prevPnt.length > 2 || pnt.length > 2 ? interpolateNumber(prevPnt[2] || 0, pnt[2] || 0) : null;
        const interpol = altInterpol ? t => [...geoInterpol(t), altInterpol(t)]: geoInterpol;

        const tStep = 1 / Math.ceil(dist / maxDegDistance);

        let t = tStep;
        while (t < 1) {
          result.push(interpol(t));
          t += tStep;
        }
      }
    }

    result.push(prevPnt = pnt);
  });

  return result;
};

export default interpolateLine;
