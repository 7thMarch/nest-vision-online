
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { initializeModel } from './lib/detector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);

  const loadModel = async () => {
    setIsModelLoading(true);
    setModelError(null);
    try {
      const success = await initializeModel();
      if (!success) {
        throw new Error('Failed to initialize model');
      }
    } catch (error) {
      setModelError('Failed to load the bird nest detection model. Please check your connection and try again.');
    } finally {
      setIsModelLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (modelError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage message={modelError} onRetry={loadModel} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
