import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

const uploadImageUtil = async (image: File): Promise<CloudinaryResponse> => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData
  );

  return response.data;
};

export const uploadImage = async (image: File): Promise<string> => {
  try {
    const uploadResult = await uploadImageUtil(image);
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const uploadImages = async (images: File[]): Promise<string[]> => {
  try {
    const uploadPromises = images.map(image => uploadImageUtil(image));
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults.map(result => result.secure_url);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};
