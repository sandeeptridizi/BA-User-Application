const AWS_BUCKET_PREFIX = "ba";
const AWS_CDN_ENDPOINT = "https://bauctionprod.s3.ap-south-1.amazonaws.com";

export const getFile = (key) => {
  return `${AWS_CDN_ENDPOINT}/${AWS_BUCKET_PREFIX}/${key}`;
};
