import { S3Client } from '@aws-sdk/client-s3';

const bucketRegion = process.env.AWS_BUCKET_REGION!;
const bucketName = process.env.AWS_BUCKET_NAME!;
const accessKey = process.env.AWS_ACCESS_KEY!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

const s3 = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey,
	},
	region: bucketRegion,
});

const envVars = { bucketName, bucketRegion, accessKey, secretAccessKey };

export { s3, envVars };
