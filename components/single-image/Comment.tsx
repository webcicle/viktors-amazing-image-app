import { Comment } from '@prisma/client';
import React from 'react';

type Props = {
	comment: Comment;
};

const Comment = ({ comment }: Props) => {
	const { comment: commentText, userId } = comment;
	return <div>{commentText}</div>;
};

export default Comment;
