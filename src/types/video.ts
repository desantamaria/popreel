export interface VideoUploadProps {
  maxSize: number; // in MB
  maxDuration: number; // in minutes
  acceptedFormats: string[];
  onUpload: (file: File) => void;
}
