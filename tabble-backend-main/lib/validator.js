'use strict';

const ajv = new require('ajv')();
ajv.addKeyword('shouldHave', {
  schema: true,
  validate: function validateUriData(key, data, schema, dataPath) {
    validateUriData.errors = [{ keyword: 'shouldHave', message: `${dataPath.substr(1)} should contain ${key}`, params: { shouldHave: key } }];
    return data.includes(key);
  }
});

const { ValidationError } = require('./errors');

class Validator {

  async validate(payload, schema) {
    const validate = ajv.compile(schema);
    const valid = validate(payload);
    if (!valid) {
      const error = this.showValidationError(validate.errors);
      throw new ValidationError(error);
    }
    return true;
  }

  showValidationError(errors) {
    let errorMessages = [];
    errors.forEach(error => {
      if (error.message) {
        errorMessages.push(this.generateErrorMessage(error));
      }
    });
    errorMessages = errorMessages.join(', ');
    return errorMessages;
  }

  generateErrorMessage(error) {
    const filter = {
      'minLength': error => {
        return `${error.dataPath.substr(1)} cannot be blank.`;
      },
      'required': error => {
        return `${error.dataPath.substr(1)}${error.params.missingProperty} is required.`;
      },
      'uniqueItems': error => {
        return `${error.dataPath.substr(1)} ${error.message}.`;
      },
      'type': error => {
        return `${error.dataPath.substr(1)} ${error.message}.`;
      },
      'minItems': error => {
        return `${error.dataPath.substr(1)} cannot be empty.`;
      },
      'format': error => {
        return `${error.dataPath.substr(1)} ${error.message}.`;
      },
      '': error => {
        return error.message;
      }
    };
    const validationKey = Object.keys(filter).includes(error.keyword) ? error.keyword : '';
    return filter[validationKey](error);
  }

}

module.exports = {
  Validator
};
