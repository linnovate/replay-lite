
function gpsu(v) {
  v = v.match(/\d{1,3}$|\d{1,2}/g)
  v = v.map(v => parseInt(v))
  v[0] += 2000;
  v[1] -= 1;
  var date = new Date();
  date.setFullYear.apply(date, v.slice(0, 3))
  date.setHours.apply(date, v.slice(4))
  return {k: 'utc', v: date.getTime()};
}

function gpsp(v) {
  return {k: 'gps_accuracy', v: v};
}

function gpsf(v) {
  return {k: 'gps_fix', v: v};
}

function tmpc(v) {
  return null;
}

function siun(v, tmp) {
  tmp.unit = v;
  return null;
}

function scal(v, tmp) {
  if(v.length == 1) {
    v = v[0]
  }
  tmp.scale = v;
  return null;
}

function accl(v, tmp) {
  // return {k: 'acceleration', v: null}
  if(tmp.scale != 418) throw new Error('ACCL ERROR: unknown scale ' + tmp.scale);
  if(tmp.unit != 'm/s2') throw new Error('ACCL ERROR: unknown unit ' + tmp.unit);
  v = v.map((v) => {
    return v.map(v => v / /*9.80665 /*/ tmp.scale);
  })
  tmp.unit = null;
  tmp.scale = null;
  return {k: 'acceleration', v: v}
}

function gyro(v, tmp) {
  // return {k: 'gyroscope', v: null};
  if(tmp.scale != 3755) throw new Error('GYRO ERROR: unknown scale ' + tmp.scale);
  if(tmp.unit != 'rad/s') throw new Error('GYRO ERROR: unknown unit ' + tmp.unit);
  v = v.map((v) => {
    return v.map(v => v / tmp.scale);
  })
  tmp.unit = null;
  tmp.scale = null;
  return {k: 'gyroscope', v: v};
}

function gps5(v, tmp) {
  v = v.map((v) => {
    return v.map((v, i) => v / tmp.scale[i])
  })
  return {k: 'gps5', v: v};
}

function tsmp(v) {
  return null;
}

module.exports = function(value, label, tmp) {
  switch (label) {
    case 'GPSU':
      return gpsu(value);
      break;
    case 'GPSP':
      return gpsp(value);
      break;
    case 'GPSF':
      return gpsf(value);
      break;
    case 'SIUN':
      return siun(value, tmp)
      break;
    case 'SCAL':
      return scal(value, tmp);
      break;
    case 'ACCL':
      return accl(value, tmp);
      break;
    case 'GYRO':
      return gyro(value, tmp);
      break;
    case 'GPS5':
      return gps5(value, tmp);
      break;
    case 'TSMP':
      return tsmp(value);
      break;
    case 'TMPC':
      return tmpc(value);
      break;
    default:
      return {k: label, v: value};
  }
}
