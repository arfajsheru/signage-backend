export interface UploadResult {
  url: string;
  public_id: string;
  format: string;
  bytes: number;
}

export interface IStorageProvider {
  uploadFile(file: Buffer, folder: string, fileName?: string): Promise<UploadResult>;
  deleteFile(publicId: string): Promise<void>;
}
