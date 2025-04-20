
import React, { useState, useCallback } from 'react';
import ImageUpload from '@/components/ImageUpload';
import DetectionCanvas from '@/components/DetectionCanvas';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { detectBirdNests } from '@/lib/detector';

export default function Index() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<Array<{ bbox: [number, number, number, number]; score: number }>>([]);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create URL for preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      // Process image
      const results = await detectBirdNests(file);
      setDetections(results);
    } catch (error) {
      console.error('Detection failed:', error);
      setError('Failed to process the image. Please try again with a different image.');
      // Cleanup URL if error occurs
      URL.revokeObjectURL(imageUrl);
      setImageUrl('');
    } finally {
      setIsProcessing(false);
    }
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Bird Nest Detection</h1>
        
        <div className="space-y-8">
          <ImageUpload
            onImageUpload={handleImageUpload}
            isProcessing={isProcessing}
          />
          
          {error && <ErrorMessage message={error} />}
          
          {imageUrl && !error && (
            <div className="mt-8">
              <DetectionCanvas
                imageUrl={imageUrl}
                detections={detections}
                width={640}
                height={480}
              />
              {detections.length === 0 && !isProcessing && (
                <p className="text-center text-gray-600 mt-4">
                  No bird nests detected in this image.
                </p>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="text-center text-gray-600">
              <LoadingSpinner />
              <p className="mt-2">Processing image...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
