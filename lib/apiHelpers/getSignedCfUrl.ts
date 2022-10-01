import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { envVars } from '../../aws/s3';
import fs from 'fs';

interface ImageIdsForSignedUrl {
	created: Date;
	id: string;
	url?: string;
}

type Props = ImageIdsForSignedUrl[];

const getSignedCfUrl = async (imageIds: Props) => {
	for (const imageId of imageIds) {
		const getObjectParams = {
			Bucket: envVars.bucketName,
			Key: imageId.id,
		};

		// const command = new GetObjectCommand(getObjectParams);
		// const url = await getSignedUrl(s3, command, {
		// 	expiresIn: 3600,
		// });

		const getFileInfo = (filePath: string) => {
			let pemKey: string = '';
			return new Promise((resolve, reject) => {
				const reader = fs.createReadStream(filePath);
				reader.on('error', (error) => {
					reject('There was an error');
				});
				reader.on('data', (chunk) => {
					pemKey = chunk.toString();
					resolve(pemKey);
				});
			});
		};

		const pemKey = await getFileInfo('private_key.pem');

		const cfUrl = `https://d2d5ackrn9fpvj.cloudfront.net/${imageId.id}`;

		const privateKey: string = JSON.parse(
			process.env.PUBLIC_CLOUDFRONT_PRIVATE_KEY_JSON!
		);

		const url = getSignedUrl({
			url: cfUrl,
			dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toString(),
			privateKey:
				process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
					? privateKey.toString()
					: (pemKey as string),
			keyPairId: process.env.PUBLIC_CLOUDFRONT_KEY_PAIR_ID!,
		});

		imageId.url = url;
		// image.url =
		// 	'https://d2d5ackrn9fpvj.cloudfront.net/cl88t16cr0014xzvzzim1oiio';
	}
	return imageIds;
};

export default getSignedCfUrl;
