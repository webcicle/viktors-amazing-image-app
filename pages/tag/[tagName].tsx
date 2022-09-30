import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import MainLayout from '../../layouts/main';

type Props = {
	cookie: string;
};

const TagPage = ({ cookie }: Props) => {
	const {
		query: { tagName },
	} = useRouter();
	return <MainLayout cookie={cookie}>{tagName}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const cookie = req.cookies.vikAmazimg;

	return {
		props: {
			cookie,
		},
	};
};

export default TagPage;
