import axios from 'axios';
import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import StatusModule from '../status-modules/StatusModule';
import styles from './ImageForm.module.css';

type Props = {};

const ImageForm: React.FC<Props> = ({}) => {
	const [file, setFile] = useState<File>();
	const [caption, setCaption] = useState<string>('');
	const [previewFit, setPreviewFit] = useState<any>('cover' as any);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isUploaded, setIsUploading] = useState<boolean>(false);

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

	const submitForm = async (event: FormEvent) => {
		event.preventDefault();
		if (file === undefined) return alert('Please select an image to upload');
		const data = new FormData();
		data.append('image', file as File);
		data.append('caption', caption);
		data.append('fit', previewFit);
		setIsLoading(true);
		const newImage = await axios.post('/api/image', data);
		if (newImage.status === 201) {
			setIsLoading(false);
			setIsUploading(true);
			return;
		}
		setIsLoading(false);
		alert('There was an error uploading your image, please try again');
		console.log(newImage);
	};

	return (
		<div className={styles.main}>
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
					{isLoading && <StatusModule type='loading' />}
					{isUploaded && <StatusModule type='success' />}
				</div>
			)}
			{/* PREVIEW MODAL ABOVE */}
			<form
				className={styles.imageUploadForm}
				encType='multipart/form-data'
				onSubmit={submitForm}>
				<input
					type='file'
					name='file'
					accept='image/*'
					className={`${styles.inputElement} ${styles.fileInput}`}
					onChange={handleChange}
					disabled={isLoading || isUploaded}
				/>
				<textarea
					name='caption'
					className={`${styles.inputElement} ${styles.captionInput}`}
					placeholder='Enter the caption for your photo here'
					onChange={handleChange}
					rows={4}
					disabled={isLoading || isUploaded}
				/>
				<button
					type='submit'
					className={styles.submitBtn}
					disabled={isLoading || isUploaded}>
					Upload
				</button>
			</form>
		</div>
	);
};

export default ImageForm;
