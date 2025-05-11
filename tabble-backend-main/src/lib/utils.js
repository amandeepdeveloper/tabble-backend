'use strict';

const moment = require('moment');

function getTimestamp(timestamp, timezone) {
  let ts = moment(timestamp)
    .utc()
    .format('x');
  if (timezone) {
    ts = moment(timestamp)
      .tz(timezone)
      .format('x');
  }
  return parseInt(ts);
}

function getIsoTime() {
  const isoDate = new Date().toISOString();
  return isoDate;
}

function objectFlip(obj) {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    newObj[obj[key]] = key;
  });
  return newObj;
}

module.exports = {
  getTimestamp,
  getIsoTime,
  objectFlip
};
