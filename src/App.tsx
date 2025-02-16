import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle, Brain, Heart, Stethoscope, Activity, FileWarning, Phone, Globe } from 'lucide-react';

interface AnalysisResult {
  organName: string;
  confidence: number;
  anomalies: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true);
    // Simulate analysis - in a real app, this would call a backend service
    setTimeout(() => {
      setResults([
        {
          organName: 'Brain',
          confidence: 98.5,
          anomalies: [
            {
              type: 'Aneurysm',
              severity: 'medium',
              description: 'Detected potential aneurysm in anterior cerebral artery'
            }
          ]
        },
        {
          organName: 'Blood Vessels',
          confidence: 95.2,
          anomalies: []
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Medical Image Analysis</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://likelook.wixsite.com/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <Globe className="w-5 h-5" />
              <span className="hidden sm:inline">Like Look Solutions</span>
            </a>
            <a
              href="https://wa.me/5511970603441"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline">Contact Us</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Tomography Image</h2>
            
            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, DICOM up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setResults([]);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            {previewUrl && !isAnalyzing && results.length === 0 && (
              <button
                onClick={handleAnalyze}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Activity className="w-5 h-5" />
                <span>Analyze Image</span>
              </button>
            )}

            {isAnalyzing && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Analyzing image...</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
            
            {results.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <FileWarning className="mx-auto h-12 w-12" />
                <p className="mt-2">No analysis results yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.organName === 'Brain' ? (
                        <Brain className="w-5 h-5 text-blue-600" />
                      ) : result.organName === 'Heart' ? (
                        <Heart className="w-5 h-5 text-red-600" />
                      ) : (
                        <Stethoscope className="w-5 h-5 text-green-600" />
                      )}
                      <h3 className="font-medium">{result.organName}</h3>
                      <span className="text-sm text-gray-500">
                        ({result.confidence.toFixed(1)}% confidence)
                      </span>
                    </div>

                    {result.anomalies.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {result.anomalies.map((anomaly, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start space-x-2 p-2 rounded-lg ${
                              anomaly.severity === 'high'
                                ? 'bg-red-50'
                                : anomaly.severity === 'medium'
                                ? 'bg-yellow-50'
                                : 'bg-green-50'
                            }`}
                          >
                            <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                              anomaly.severity === 'high'
                                ? 'text-red-500'
                                : anomaly.severity === 'medium'
                                ? 'text-yellow-500'
                                : 'text-green-500'
                            }`} />
                            <div>
                              <p className="font-medium">{anomaly.type}</p>
                              <p className="text-sm text-gray-600">
                                {anomaly.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mt-2">
                        No anomalies detected
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2024 Like Look Solutions. Developed by Julio Campos Machado</p>
            <p className="mt-1">
              <a
                href="https://wa.me/5511970603441"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Contact: +55 11 97060-3441
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}