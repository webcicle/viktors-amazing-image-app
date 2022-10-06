import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import fs from 'fs';

const getSignedCloudfrontUrl = async (cfUrl: string) => {
	let signedCfUrl;
	if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
		const privateKey: string =
			process.env.PUBLIC_CLOUDFRONT_PRIVATE_KEY!.replace(/\\n/g, '\n');

		signedCfUrl = getSignedUrl({
			url: cfUrl,
			dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toString(),
			privateKey: privateKey,
			keyPairId: process.env.PUBLIC_CLOUDFRONT_KEY_PAIR_ID!,
		});
	} else {
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

		signedCfUrl = getSignedUrl({
			url: cfUrl,
			dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toString(),
			privateKey: pemKey as string,
			keyPairId: process.env.PUBLIC_CLOUDFRONT_KEY_PAIR_ID!,
		});
	}
	return signedCfUrl;
};

export default getSignedCloudfrontUrl;
