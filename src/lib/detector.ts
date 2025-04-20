
import * as tf from '@tensorflow/tfjs';

// Model configurations
const MODEL_INPUT_SIZE = 640;
const CONFIDENCE_THRESHOLD = 0.5;

let model: tf.LayersModel | null = null;

async function preprocessImage(imageFile: File): Promise<tf.Tensor> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Convert image to tensor and preprocess
        const tensor = tf.tidy(() => {
          const imageTensor = tf.browser.fromPixels(img);
          // Resize to YOLOv8 input size
          const resized = tf.image.resizeBilinear(imageTensor, [MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]);
          // Normalize to [0,1] and add batch dimension
          return resized.div(255.0).expandDims(0);
        });
        resolve(tensor);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(imageFile);
  });
}

export async function initializeModel() {
  try {
    // Load model from the public/models directory
    model = await tf.loadLayersModel('/models/birdnest/model.json');
    // Warmup run
    const dummyInput = tf.zeros([1, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, 3]);
    const warmupResult = await model.predict(dummyInput);
    if (Array.isArray(warmupResult)) {
      warmupResult.forEach(tensor => tensor.dispose());
    } else {
      warmupResult.dispose();
    }
    dummyInput.dispose();
    console.log('Bird nest detection model initialized');
    return true;
  } catch (error) {
    console.error('Error initializing model:', error);
    return false;
  }
}

interface Detection {
  bbox: [number, number, number, number];
  score: number;
}

export async function detectBirdNests(imageFile: File): Promise<Detection[]> {
  if (!model) {
    throw new Error('Model not initialized');
  }

  const tensor = await preprocessImage(imageFile);

  try {
    // Run inference
    const predictions = await model.predict(tensor);
    
    // Process YOLO output
    const [boxes, scores] = tf.tidy(() => {
      const outputArray = Array.isArray(predictions) ? predictions[0] : predictions;
      return [
        outputArray.slice([0, 0, 0], [1, -1, 4]),
        outputArray.slice([0, 0, 4], [1, -1, 1])
      ];
    });

    // Convert tensors to arrays
    const boxesArray = await boxes.data();
    const scoresArray = await scores.data();

    // Clean up tensors
    tf.dispose([tensor]);
    if (Array.isArray(predictions)) {
      predictions.forEach(tensor => tensor.dispose());
    } else {
      predictions.dispose();
    }
    boxes.dispose();
    scores.dispose();

    // Format detections
    const detections: Detection[] = [];
    for (let i = 0; i < scoresArray.length; i++) {
      if (scoresArray[i] > CONFIDENCE_THRESHOLD) {
        detections.push({
          bbox: [
            boxesArray[i * 4],
            boxesArray[i * 4 + 1],
            boxesArray[i * 4 + 2] - boxesArray[i * 4],
            boxesArray[i * 4 + 3] - boxesArray[i * 4 + 1]
          ] as [number, number, number, number],
          score: scoresArray[i]
        });
      }
    }

    return detections;
  } catch (error) {
    console.error('Error during detection:', error);
    throw error;
  }
}
