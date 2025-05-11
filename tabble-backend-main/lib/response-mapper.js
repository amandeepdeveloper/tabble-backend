/**
 * Represents an API response object with a status code, data, and an optional message.
 *
 * @class
 */
class ApiResponse {
  /**
   * Creates a new API response instance.
   *
   * @constructor
   * @param {number} statusCode - The HTTP status code of the response.
   * @param {any} data - The data to be included in the response.
   * @param {string} [message='Success'] - An optional message associated with the response.
   * @param {object} [pagination] - An optional object containing pagination metadata.
   */
  constructor(statusCode, data, message = "Success") {
    /**
     * The HTTP status code of the response.
     * @type {number}
     */
    this.statusCode = statusCode;

    /**
     * An optional message associated with the response.
     * @type {string}
     */
    this.message = message;

    /**
     * A boolean indicating the success of the response based on the status code (statusCode < 400).
     * @type {boolean}
     */
    this.success = statusCode < 400;

    /**
     * The data included in the response.
     * @type {any}
     */
    this.data = data;
  }
}

/**
 * Sends an API response to the client.
 *
 * @function
 * @param {import('express').Response} res - The Express response object.
 * @param {number} code - The HTTP status code to be included in the response.
 * @param {any} data - The data to be included in the response.
 * @param {string} message - An optional message associated with the response.
 * @returns {Object} - The response object sent to the client.
 */
exports.sendResponse = (res, code, data, message) => {
  const resData = new ApiResponse(code, data, message);
  return res.status(code).json(resData);
};
