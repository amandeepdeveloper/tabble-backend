'use strict';

class UniqueIndexError extends Error{
  get name() {
    return 'UniqueIndexError';
  }
}


module.exports = {
  UniqueIndexError
};
