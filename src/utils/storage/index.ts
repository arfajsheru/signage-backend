import { CloudinaryProvider } from './cloudinary.provider.js';
import { IStorageProvider } from './storage.interface.js';

// Currently using Cloudinary, but can be switched to S3Provider etc later
export const storage: IStorageProvider = new CloudinaryProvider();
