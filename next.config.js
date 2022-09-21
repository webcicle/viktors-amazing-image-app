/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	webpack: (config) => {
		config.resolve.fallback = { fs: false, path: false };

		return config;
	},
	images: {
		domains: [
			'viktors-amazing-image-app.s3.eu-west-3.amazonaws.com',
			'd2d5ackrn9fpvj.cloudfront.net',
		],
	},
};

module.exports = nextConfig;
