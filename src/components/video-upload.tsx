"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Video,
  FileType,
  MonitorPlay,
  RatioIcon as AspectRatio,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { VideoDetails, VideoUploadProps } from "@/types/video";

export default function VideoUpload({
  maxSize = 10,
  maxDuration = 60,
  acceptedFormats = [".mp4"],
  onUpload,
}: VideoUploadProps) {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setVideoDetails({
          filename: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
          uploaded: true,
        });
        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": acceptedFormats,
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
  });

  if (videoDetails) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Video className="h-6 w-6" />
              <div>
                <p className="font-medium">{videoDetails.filename}</p>
                <p className="text-sm text-muted-foreground">
                  {videoDetails.size}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setVideoDetails(null)}>
              Replace
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a description..."
                className="mt-2"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Add a location..."
                className="mt-2"
              />
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
    </div>
  );
}
