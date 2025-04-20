
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Enable TensorFlow.js WebGL backend
import * as tf from '@tensorflow/tfjs';
tf.setBackend('webgl');

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
