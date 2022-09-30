import Head from 'next/head';
import { ReactNode } from 'react';
import { Header } from '../components';

type Props = {
	cookie: string;
	children: ReactNode;
};

const styles = {
	width: 'clamp(100px, 90vw, 500px)',
	marginInline: 'auto',
};

const MainLayout: React.FC<Props> = ({ cookie, children }) => {
	return (
		<>
			<Head>
				<title>Viktor&apos;s Amazing Image App</title>
				<meta
					name='description'
					content='Upload your amazzzzzing images for the world to see!'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div style={styles}>
				<Header cookie={cookie} />
				{children}
			</div>
		</>
	);
};

export default MainLayout;
