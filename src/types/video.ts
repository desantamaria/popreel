export interface VideoDetails {
  filename: string;
  size: string;
  uploaded: boolean;
  description?: string;
  location?: string;
}

export interface VideoUploadProps {
  maxSize: number; // in MB
  maxDuration: number; // in minutes
  acceptedFormats: string[];
  onUpload: (file: File) => void;
}
