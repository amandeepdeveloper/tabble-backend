'use strict';

const tokenAuth = require(`${appRoot}/lib/tokenauth`);
const commonValidator = require(`${appRoot}/lib/validator`);
const path = require('path');
const fs = require('fs');

function pathIsDirectory(path) {
  return fs.lstatSync(path).isDirectory();
}

function skipLoading(file) {
  return file.indexOf('.js') < 0 || file.indexOf('index.js') > -1;
}

function loadRoute(route, app, commonValidator, eventEmitter) {
  return require(route)(app, tokenAuth, commonValidator, eventEmitter);
}

function loadRoutes(app, eventEmitter, entryPoint = __dirname, { validator } = {}) {
  // Override default commonValidator
  validator = validator || commonValidator;
  const walk = function (newPath, depth = 0) {
    const items = fs.readdirSync(newPath);
    items.forEach(entry => {
      const currentPath = path.join(path.resolve(newPath), entry);
      if (pathIsDirectory(currentPath)) {
        walk(currentPath, depth + 1);
      } else {
        const skipRoute = skipLoading(currentPath);
        if (skipRoute) {
          return;
        }
        loadRoute(currentPath, app, validator, eventEmitter);
      }
    });
  };
  walk(entryPoint, 0);
}

module.exports.loadRoutes = loadRoutes;
