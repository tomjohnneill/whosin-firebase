### Description of where different parts of the app are kept

  * Firebase for the hosting, most cloud functions and database
  * S3 for picture storage
  * AWS Lambda for getting presigned S3 upload URLs and dynamically resizing images on the fly
  * Cloudfront for storing and resizing images
  * Google Apps Script with a time based trigger to run cloud functions
