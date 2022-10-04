import Head from 'next/head';
import { ReactNode } from 'react';
import { Header } from '../components';
import useMediaQuery from '../hooks/useMediaQuery';

type Props = {
	cookie: string;
	children: ReactNode;
};

const MainLayout: React.FC<Props> = ({ cookie, children }) => {
	const isDesktop = useMediaQuery(900, true);
	const isMobile = useMediaQuery(600, false);
	const styles = {
		outer: {
			width: !isDesktop ? '95vw' : 'clamp(100px, 90vw, 750px)',
			marginInline: 'auto',
		},
		inner: {
			// width: isMobile ? '100%' : 'clamp(100px, 90%, 500px)',
			width: '100%',
			marginRight: 'auto',
			marginTop: '2rem',
		},
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
			<div style={styles.outer}>
				<Header cookie={cookie} />
				<div style={styles.inner}>{children}</div>
			</div>
		</>
	);
};

export default MainLayout;
