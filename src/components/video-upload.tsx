import { AddVideoToNeon } from "@/actions/addVideoToNeon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVideoUploadStore } from "@/stores/video-upload-store";
import type { VideoUploadProps } from "@/types/video";
import { upload } from "@vercel/blob/client";
import {
  RatioIcon as AspectRatio,
  FileType,
  MonitorPlay,
  Upload,
  Video,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import CategorySelect from "./category-select";
import { getOpenAIEmbeddings } from "@/lib/getEmbeddings";
import { toast } from "sonner";

export default function VideoUpload({
  maxSize = 10,
  maxDuration = 60,
  acceptedFormats = [".mp4"],
}: VideoUploadProps) {
  const {
    loading,
    filename,
    size,
    uploaded,
    caption,
    location,
    file,
    categories,
    setLoading,
    setFilename,
    setSize,
    setUploaded,
    setCaption,
    setLocation,
    setCategories,
    setFile,
  } = useVideoUploadStore();

  const onDrop = (acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFilename(newFile.name);
      setSize(`${(newFile.size / (1024 * 1024)).toFixed(2)}MB`);
      setUploaded(true);
      setFile(newFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": acceptedFormats,
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
  });

  async function handleSubmit() {
    if (!file) {
      return;
    }
    setLoading(true);

    // Upload to Vercel Blob
    const newBlob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/video/upload",
    });

    const inputMetadata = {
      categories: categories,
      location: location,
      caption: caption,
    };

    const embedding = await getOpenAIEmbeddings(JSON.stringify(inputMetadata));

    // Add Video Entry to DB
    AddVideoToNeon(newBlob.url, inputMetadata, embedding);

    toast.success("Video Uploaded Successful!");
    setLoading(false);
  }

  if (filename && size && uploaded) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Video className="h-6 w-6" />
              <div>
                <p className="font-medium">{filename}</p>
                <p className="text-sm text-muted-foreground">{size}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setFilename(null);
                setSize(null);
                setUploaded(false);
                setCaption(null);
                setLocation(null);
                setCategories([]);
              }}
            >
              Replace
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Add a caption..."
                className="mt-2"
                rows={4}
                onChange={(e) => {
                  setCaption(e.target.value);
                }}
                value={caption || ""}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Add a location..."
                className="mt-2"
                onChange={(e) => setLocation(e.target.value)}
                value={location || ""}
              />
            </div>
            <div>
              <CategorySelect />
            </div>
            <div>
              <Button className="w-full" onClick={handleSubmit}>
                Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center hover:bg-accent transition-colors cursor-pointer
              ${
                isDragActive
                  ? "border-primary bg-accent"
                  : "border-muted-foreground/25"
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Select video to upload
            </h3>
            <p className="text-sm text-muted-foreground">
              Or drag and drop it here
            </p>
            <Button className="mt-4">Select video</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <Video className="w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Size and duration</h3>
              <p className="text-sm text-muted-foreground">
                Maximum size: {maxSize}MB, video duration: {maxDuration}{" "}
                minutes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <FileType className="w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">File formats</h3>
              <p className="text-sm text-muted-foreground">
                Recommended: .mp4. Other major formats are supported.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <MonitorPlay className="w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Video resolutions</h3>
              <p className="text-sm text-muted-foreground">
                High-resolution recommended: 1080p.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-start gap-3">
            <AspectRatio className="w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Aspect ratios</h3>
              <p className="text-sm text-muted-foreground">
                Recommended: 16:9 for landscape, 9:16 for vertical.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {loading && (
        <>
          <div role="status" className="flex justify-center mt-10 my-10">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </>
      )}
    </div>
  );
}
