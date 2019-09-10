const getInterpolatedVals = (start, end, numPnts) => {
  const result = [];

  for (let i=1; i <= numPnts; i++) {
    result.push(start + (end - start) * i / (numPnts + 1));
  }

  return result;
};

const interpolateLine = (lineCoords = [], maxDegDistance = 1) => {
  const result = [];

  let prevPnt = null;
  lineCoords.forEach(pnt => {
    if (prevPnt) {
      const dist = Math.sqrt(Math.pow(pnt[0] - prevPnt[0], 2) + Math.pow(pnt[1] - prevPnt[1], 2));

      if (dist > maxDegDistance) {
        const numAdditionalPnts = Math.floor(dist / maxDegDistance);

        const lngs = getInterpolatedVals(prevPnt[0], pnt[0], numAdditionalPnts);
        const lats = getInterpolatedVals(prevPnt[1], pnt[1], numAdditionalPnts);

        for (let i=0, len=lngs.length; i<len; i++) {
          result.push([lngs[i], lats[i]]);
        }
      }
    }

    result.push(prevPnt = pnt);
  });

  return result;
};

export default interpolateLine;
