'use strict';

const { sessionStorageFactory } = require('../storage');

const defaultRepo = () => {
  return {
    sessionRepository: sessionStorageFactory.repository,
  };
};

class SessionProvider {

  constructor({ sessionRepository } = defaultRepo()) {
    this.sessionRepository = sessionRepository;
  }

  async addNewSession(payload) {
    return await this.sessionRepository.addSession(payload);
  }
}

module.exports = {
    SessionProvider
};
