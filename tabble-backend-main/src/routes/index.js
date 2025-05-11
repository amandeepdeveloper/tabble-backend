'use strict';

const routeLoader = require(`${appRoot}/lib/recursive-route-loader`);

module.exports = function(app, eventEmitter) {
  routeLoader.loadRoutes(app, eventEmitter, __dirname);
};
