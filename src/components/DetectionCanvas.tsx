
import React, { useEffect, useRef } from 'react';

interface DetectionCanvasProps {
  imageUrl: string;
  detections: Array<{
    bbox: [number, number, number, number];
    score: number;
  }>;
  width?: number;
  height?: number;
}

const DetectionCanvas: React.FC<DetectionCanvasProps> = ({
  imageUrl,
  detections,
  width = 640,
  height = 480,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw detections
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.font = '16px Arial';
      ctx.fillStyle = '#00ff00';

      detections.forEach(({ bbox, score }) => {
        const [x, y, w, h] = bbox;
        ctx.strokeRect(x, y, w, h);
        ctx.fillText(`Bird Nest: ${Math.round(score * 100)}%`, x, y - 5);
      });
    };
  }, [imageUrl, detections]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="max-w-full h-auto border rounded-lg shadow-lg"
    />
  );
};

export default DetectionCanvas;
