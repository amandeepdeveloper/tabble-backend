'use strict';

const { Sessions } = require(`${modelsPath}`);

const defaultModel = () => {
  return Sessions;
};

class SessionRepository {

  constructor(Sessions = defaultModel()) {
    this.Sessions = Sessions;
  }

  async deleteSession(conditions) {
    return await this.Sessions.deleteSessions(conditions);
  }

}

module.exports = {
    SessionRepository
};
