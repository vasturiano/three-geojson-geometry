import { geoDistance, geoInterpolate } from 'd3-geo';

const interpolateLine = (lineCoords = [], maxDegDistance = 1) => {
  const result = [];

  let prevPnt = null;
  lineCoords.forEach(pnt => {
    if (prevPnt) {
      const dist = geoDistance(pnt, prevPnt) * 180 / Math.PI;
      if (dist > maxDegDistance) {
        const interpol = geoInterpolate(prevPnt, pnt);
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
