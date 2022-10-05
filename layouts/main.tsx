import Head from 'next/head';
import { ReactNode } from 'react';
import { Header } from '../components';
import useMediaQuery from '../hooks/useMediaQuery';

type Props = {
	cookie: string;
	children: ReactNode;
	page?: string;
};

const MainLayout: React.FC<Props> = ({ cookie, children, page }) => {
	const isDesktop = useMediaQuery(900, true);
	const isMobile = useMediaQuery(600, false);
	const styles = {
		outer: {
			width:
				page === 'frontPage'
					? 'clamp(100px, 95vw, 600px)'
					: 'clamp(100px, 95vw, 800px)',
			marginInline: 'auto',
		},
		inner: {
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
