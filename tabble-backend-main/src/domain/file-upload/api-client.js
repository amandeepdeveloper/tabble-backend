"use strict";

const fs = require("fs");
const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME
} = require("../../../config/aws");

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  AWS_REGION: AWS_REGION,
});


const s3 = new AWS.S3();

class apiClient {
  constructor() {}

  async uploadFile(userId, file) {
    if (!file) {
      throw new Error("No file uploaded.");
    }
    const fileContent = fs.readFileSync(file.path);
    const params = {
      Bucket: AWS_BUCKET_NAME, // bucket name
      Key: `${userId}/${Date.now()}_${file.originalname}`, // File name with user id and timestamp
      Body: fileContent,
    };
    try {
      const data = await s3.upload(params).promise();
      // Delete the file from local uploads folder after uploading to S3
      fs.unlinkSync(file.path);
      return data.Location;
    } catch (error) {
      console.error(error);
      throw new Error("Error uploading file.");
    }
  }
}

module.exports = apiClient;
