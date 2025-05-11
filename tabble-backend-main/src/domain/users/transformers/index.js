'use strict';

const { OutboundUserTransformer } = require('./outbound-transformer');
const outboundUserTransformer = new OutboundUserTransformer();

module.exports = {
  outboundUserTransformer,
};
