import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

const TagPage = (props: Props) => {
	const { query } = useRouter();
	return <div>{JSON.stringify(query)}</div>;
};

export default TagPage;
