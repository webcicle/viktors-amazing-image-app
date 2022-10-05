import { Dislike, Like } from '@prisma/client';
import axios from 'axios';
import React, { useState } from 'react';

type Props = {
	userHasLiked: boolean;
	userHasDisliked: boolean;
	userLike: Like | null | undefined;
	userDislike: Dislike | null | undefined;
};

const useLikeDislike = ({
	userHasLiked,
	userHasDisliked,
	userLike,
	userDislike,
}: Props) => {
	const [liked, setLiked] = useState<boolean>(userHasLiked);
	const [disliked, setDisliked] = useState<boolean>(userHasDisliked);
	const [userLikeId, setUserLikeId] = useState<string | null>(
		userLike?.id as string
	);
	const [userDislikeId, setUserDislikeId] = useState<string | null>(
		userDislike?.id as string
	);

	const createLike = async (userId: string, imageId: string, type: string) => {
		setLiked(true);
		const like = await axios.post('/api/like', {
			userId,
			imageId,
			type,
		});
		setUserLikeId(like.data.newLike.id);
		if (like.status !== 201) {
			setLiked(false);
			alert('ERROR: There was an error liking the image, please try again');
		}
		return;
	};

	const deleteLike = async () => {
		if (liked) {
			setLiked(false);
			const unlike = await axios.put('/api/like', { id: userLikeId });
			if (unlike.status !== 204) {
				setLiked(true);
				alert('ERROR: There was an error unliking the image, please try again');
			}
			return;
		}
		return;
	};
	const createDislike = async (
		userId: string,
		imageId: string,
		type: string
	) => {
		setDisliked(true);
		const dislike = await axios.post('/api/dislike', {
			userId,
			imageId,
			type: 'image',
		});
		setUserDislikeId(dislike.data.newLike.id);
		if (dislike.status !== 201) {
			setDisliked(false);
			alert('ERROR: There was an error disliking the image, please try again');
		}
		return;
	};

	const deleteDislike = async () => {
		if (disliked) {
			setDisliked(false);
			const unDislike = await axios.put('/api/dislike', {
				id: userDislikeId,
			});
			if (unDislike.status !== 204) {
				setDisliked(true);
				alert(
					'ERROR: There was an error undisliking the image, please try again'
				);
			}
			return;
		}
		return;
	};

	return [
		createLike,
		deleteLike,
		createDislike,
		deleteDislike,
		liked,
		disliked,
	] as const;
};

export default useLikeDislike;
