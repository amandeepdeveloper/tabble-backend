'use strict';

class ValidationError extends Error{
  get name() {
    return 'ValidationError';
  }
}


module.exports = {
  ValidationError
};
