import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
});

export const S3Upload = async (fileKey: any, compressedBuffer: any, mimetype: any) => {
  const params = {
    Bucket: process.env.S3_BUCKET || "",
    Key: fileKey,
    Body: compressedBuffer,
    ContentType: mimetype,
  };

  return await s3.upload(params).promise();
};
