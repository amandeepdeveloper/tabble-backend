'use strict';

class RepositoryFactory {
  constructor (RepositoryClass = null) {
    if (!RepositoryClass) {
      throw new Error('RepositoryClass is required!');
    }

    this._defaultRepo = RepositoryClass;
    this.reset();
  }

  set repository (repo) {
    this._repo = repo;
  }

  get repository () {
    return new this._repo();
  }

  reset () {
    this._repo = this._defaultRepo;
  }
}

module.exports = {
  RepositoryFactory
};
