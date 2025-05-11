'use strict';

class AuthenticationError extends Error{
  get name() {
    return 'AuthenticationError';
  }
}


module.exports = {
  AuthenticationError
};
