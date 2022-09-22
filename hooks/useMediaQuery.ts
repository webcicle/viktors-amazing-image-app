import { useState, useCallback, useEffect, ChangeEvent } from 'react';

const useMediaQuery = (width: number, min?: boolean) => {
	const [targetReached, setTargetReached] = useState(false);

	const updateTarget = useCallback((e: any) => {
		if (e.matches) {
			setTargetReached(true);
		} else {
			setTargetReached(false);
		}
	}, []);

	useEffect(() => {
		const media = window.matchMedia(
			`(${min ? 'min' : 'max'}-width: ${width}px)`
		);
		media.addEventListener('change', updateTarget);

		// Check on mount (callback is not called until a change occurs)
		if (media.matches) {
			setTargetReached(true);
		}

		return () => media.removeEventListener('change', updateTarget);
	}, [min, updateTarget, width]);

	return targetReached;
};

export default useMediaQuery;
