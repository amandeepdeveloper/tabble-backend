'use strict';

class BadRequestError extends Error{
  get name() {
    return 'BadRequestError';
  }
}


module.exports = {
  BadRequestError
};
