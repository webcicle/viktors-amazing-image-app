import {
	SetStateAction,
	Dispatch,
	useState,
	ChangeEvent,
	KeyboardEvent,
	useRef,
	useEffect,
} from 'react';
import styles from './ImageForm.module.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import cuid from 'cuid';
import useMediaQuery from '../../hooks/useMediaQuery';

export interface Tag {
	id: string;
	tagName: string;
}

type Props = {
	tags: Tag[];
	setTags: Dispatch<SetStateAction<Tag[]>>;
};

const TagInput = ({ tags, setTags }: Props) => {
	const [newTag, setNewTag] = useState<string>('');
	const [inputHalfFull, setInputHalfFull] = useState<boolean>(false);
	const [inputHalfEmpty, setInputHalfEmpty] = useState<boolean>(false);

	const handleChange = (
		event: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
	) => {
		const { value } = event.currentTarget;
		setNewTag(value);
	};

	const createAndAddNewTag = (tag: string) => {
		if (tags.length >= 5) {
			alert('You may only use maximum five tags');
			setNewTag('');
			return;
		}
		const newTag = {
			id: cuid(),
			tagName: tag.startsWith('#') ? tag.trim().split('#').pop()! : tag.trim(),
		};
		setTags((prevTags) => [...prevTags, newTag]);
		setNewTag('');
	};

	const removeTag = (tagId: string) => {
		const tagToRemove = tags.find((tag) => tag.id === tagId);
		console.log({ tagId, tagToRemove });

		const confirmPrompt = confirm(
			`Do you want to delete tag "${tagToRemove?.tagName}"`
		);

		if (confirmPrompt) {
			const newTags = tags.filter((tag) => tag.id !== tagId);
			setTags(newTags);
		}
	};

	const keyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		const { key } = e;

		if (key === ' ' || key === ',' || key === 'Enter') return setNewTag('');
		if (key === 'Backspace' && newTag === '' && tags.length > 0) {
			removeTag(tags[tags.length - 1].id);
		}
	};

	const handleAddNewTag = (e: KeyboardEvent<HTMLInputElement>) => {
		const { key } = e;
		if ((key === ' ' && newTag.trim().length === 0) || newTag.trim() === '')
			return;
		if (key === ' ' || key === ',' || key === 'Enter') {
			createAndAddNewTag(newTag);
			setNewTag('');
			return;
		}
	};

	// DYNAMIC STYLES

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current?.clientWidth! < 350) {
			setInputHalfEmpty(false);
		} else {
			setInputHalfEmpty(true);
		}
		if (containerRef.current?.clientWidth! < 250) {
			return setInputHalfFull(false);
		} else {
			setInputHalfFull(true);
		}
	}, [tags]);

	const isMobile = useMediaQuery(500, false);

	const tagsContainerDynamicStyles = {
		flexGrow: inputHalfFull || isMobile ? '1' : '0',
		borderBottomLeftRadius: inputHalfEmpty || isMobile ? '0' : '5px',
		borderTopLeftRadius: '5px',
		borderTopRightRadius: !inputHalfEmpty ? '0px' : '5px',
	};

	const tagsInputDynamicStyles = {
		borderBottomLeftRadius: !inputHalfEmpty || !isMobile ? '0px' : '5px',
		borderTopRightRadius: !inputHalfEmpty || isMobile ? '5px' : '0px',
		borderBottomRightRadius: '5px',
	};

	return (
		<div className={styles.tags}>
			<div
				ref={containerRef}
				className={styles.tagsContainer}
				style={tagsContainerDynamicStyles}>
				{tags?.map((tag) => (
					<div key={tag.id} className={styles.tagWrapper}>
						<p className={styles.tag}>#{tag.tagName}</p>
						<button
							type='button'
							onClick={(_) => removeTag(tag.id)}
							className={styles.deleteTag}>
							<AiOutlineCloseCircle />
						</button>
					</div>
				))}
			</div>
			<input
				type='text'
				name='tag'
				style={tagsInputDynamicStyles}
				value={newTag}
				className={styles.tagInput}
				placeholder='Enter the hashtags for your image'
				onChange={handleChange}
				onKeyDown={handleAddNewTag}
				onKeyUp={keyUpHandler}
			/>
		</div>
	);
};

export default TagInput;
