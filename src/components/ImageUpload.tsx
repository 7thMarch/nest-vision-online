
import React, { useCallback, useState } from 'react';
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
        isProcessing ? "pointer-events-none opacity-50" : "hover:border-blue-500"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      <p className="text-lg text-gray-600 mb-2">
        {isProcessing ? 'Processing...' : 'Drop image here or click to upload'}
      </p>
      <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP</p>
    </div>
  );
};

export default ImageUpload;
