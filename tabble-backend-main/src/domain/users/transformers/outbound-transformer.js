"use strict";

const { Transformer } = require("./transformer");

class OutboundUserTransformer extends Transformer {
  constructor() {
    super();
  }

  transformAll(users) {
    return users.map((userDetails) => {
      userDetails.longitude = userDetails?.location?.coordinates[0];
      userDetails.latitude = userDetails?.location?.coordinates[1];
      delete userDetails.location;
      return userDetails;
    });
  }

  transform(userDetails) {
    userDetails.longitude = userDetails?.location?.coordinates[0];
    userDetails.latitude = userDetails?.location?.coordinates[1];
    delete userDetails.location;
    return userDetails;
  }
}

module.exports = {
  OutboundUserTransformer,
};
