'use strict';

const { Sessions } = require(`${modelsPath}`);

const defaultModel = () => {
  return Sessions;
};

class SessionRepository {

  constructor(Sessions = defaultModel()) {
    this.Sessions = Sessions;
  }

  async addSession(payload) {
    return await this.Sessions.addSession(payload);
  }

}

module.exports = {
    SessionRepository
};
