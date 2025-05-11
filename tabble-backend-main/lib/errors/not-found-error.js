'use strict';

class NotFoundError extends Error{
  get name() {
    return 'NotFoundError';
  }
}


module.exports = {
  NotFoundError
};
