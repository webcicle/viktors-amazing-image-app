import Head from 'next/head';
import { ReactNode } from 'react';
import { Header } from '../components';
import useMediaQuery from '../hooks/useMediaQuery';

type Props = {
	cookie: string;
	children: ReactNode;
};

const MainLayout: React.FC<Props> = ({ cookie, children }) => {
	const isMobile = useMediaQuery(400, false);
	const styles = {
		width: isMobile ? '100vw' : 'clamp(100px, 90vw, 500px)',
		marginInline: 'auto',
	};
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
