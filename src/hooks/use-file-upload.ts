import { useRef, useState } from "react";

export function useFileUpload() {
  const generateUploadUrl = ""; // TODO // Generate Upload URL

  const [storageId, setStorageId] = useState<string>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [file, setFile] = useState<File | null>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const open = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));
    setFile(file);

    const url = generateUploadUrl;
    const res = await fetch(url, {
      method: "POST",
      body: file,
    });
    const data = (await res.json()) as { storageId: string };
    //   if (storageId !== undefined && storageId !== null) {
    //     await // remove File
    //   }

    setStorageId(data.storageId);
    setIsUploading(false);
  };

  const reset = () => {
    setStorageId("");
    setPreviewUrl("");
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return {
    file,
    storageId,
    previewUrl,
    isUploading,
    open,
    reset,
    inputProps: {
      type: "file",
      className: "hidden",
      ref: inputRef,
      onChange: handleImageChange,
    },
    setStorageId,
    setPreviewUrl,
  };
}
