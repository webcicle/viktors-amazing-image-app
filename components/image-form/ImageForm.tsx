import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import StatusModule from '../status-modules/StatusModule';
import styles from './ImageForm.module.css';
import TagInput from './TagInput';

export interface Tag {
	id: string;
	tagName: string;
}

type Props = {};

const ImageForm: React.FC<Props> = () => {
	const [file, setFile] = useState<File>();
	const [caption, setCaption] = useState<string>('');
	const [tags, setTags] = useState<Tag[]>([] as Tag[]);
	const [previewFit, setPreviewFit] = useState<any>('cover' as any);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isUploaded, setIsUploaded] = useState<boolean>(false);
	const Router = useRouter();

	const changeObjectFit = () => {
		if (previewFit === 'cover') return setPreviewFit('contain');
		setPreviewFit('cover');
	};

	const handleChange = (
		event: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
	) => {
		const { name, value, files } = event.currentTarget;
		if (name === 'file' && files) return setFile(files[0]);
		return setCaption(value);
	};

	const clearForm = () => {
		setCaption('');
		setIsLoading(false);
		setIsUploaded(false);
	};

	const submitForm = async (event: FormEvent) => {
		event.preventDefault();
		if (file === undefined) return alert('Please select an image to upload');
		const data = new FormData();
		data.append('image', file as File);
		data.append('caption', caption);
		data.append('fit', previewFit);
		data.append('tags', JSON.stringify(tags));
		setIsLoading(true);
		const newImage = await axios.post('/api/image', data);
		if (newImage.status === 201) {
			setIsLoading(false);
			setIsUploaded(true);
			Router.reload();
			return;
		}
		setIsLoading(false);
		alert('There was an error uploading your image, please try again');
	};

	return (
		<div className={styles.main}>
			<form
				className={styles.imageUploadForm}
				encType='multipart/form-data'
				onSubmit={submitForm}>
				<div>
					<label className={styles.inputLabel} htmlFor='file'>
						Select an image to upload:
					</label>
					<input
						type='file'
						id='file'
						name='file'
						accept='image/*'
						className={`${styles.inputElement} ${styles.fileInput}`}
						onChange={handleChange}
						// disabled={isLoading || isUploaded}
					/>
				</div>
				<div>
					<label className={styles.inputLabel} htmlFor='file'>
						A citchy-catchy caption:
					</label>
					<textarea
						name='caption'
						className={`${styles.inputElement} ${styles.captionInput}`}
						placeholder='Enter you image caption here'
						onChange={handleChange}
						rows={4}
						disabled={isLoading || isUploaded}
						value={caption}
					/>
				</div>

				<TagInput tags={tags} setTags={setTags} />

				{!isUploaded && (
					<button
						type='submit'
						className={styles.submitBtn}
						disabled={isLoading || isUploaded}>
						Upload
					</button>
				)}
			</form>
			{isUploaded && (
				<button
					type='button'
					onClick={clearForm}
					className={styles.submitBtn}
					disabled={!isUploaded}>
					Upload another picture
				</button>
			)}
			{/* PREVIEW MODAL BELOW */}
			{file !== undefined && (
				<div>
					{!isLoading && !isUploaded && (
						<>
							<div className={styles.previewImage}>
								<Image
									src={URL.createObjectURL(file)}
									layout={'responsive'}
									height={500}
									width={500}
									objectFit={previewFit}
								/>
							</div>
							<button className={styles.fitButton} onClick={changeObjectFit}>
								{previewFit === 'cover' ? 'Fit in frame' : 'Cover frame'}
							</button>
						</>
					)}
					{isLoading && (
						<StatusModule
							minWidth={'85vw'}
							minHeight={'200px'}
							type='loading'
						/>
					)}
					{isUploaded && (
						<StatusModule
							minWidth={'85vw'}
							minHeight={'200px'}
							type='success'
						/>
					)}
				</div>
			)}
			{/* PREVIEW MODAL ABOVE */}
		</div>
	);
};

export default ImageForm;
