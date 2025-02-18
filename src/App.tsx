import React, { useState, useCallback } from 'react';
import { Upload, Brain, Phone, Globe } from 'lucide-react';
import { ImageAnalyzer } from './utils/imageAnalysis';
import { MedicalAnalysisResult } from './types/analysis';

const imageAnalyzer = new ImageAnalyzer();

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<MedicalAnalysisResult | null>(null);

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

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    try {
      const analysisResults = await imageAnalyzer.analyzeImage(selectedFile);
      setResults(analysisResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile]);

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

      {/* Usage Instructions */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-3">Como Usar</h2>
              <ol className="space-y-2 text-blue-800">
                <li>1. Faça upload de uma imagem de tomografia</li>
                <li>2. Clique no botão "Analyze Image" para iniciar a análise</li>
                <li>3. Aguarde o processamento da imagem</li>
                <li>4. Visualize os resultados detalhados da análise</li>
              </ol>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-3">Arquivos Aceitos</h2>
              <ul className="space-y-2 text-blue-800">
                <li>• Imagens de Tomografia (CT Scan)</li>
                <li>• Formatos: PNG, JPG, JPEG</li>
                <li>• Tamanho máximo: 10MB</li>
                <li>• Resolução recomendada: 512x512 pixels ou maior</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
                    PNG, JPG up to 10MB
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
                    setResults(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            {previewUrl && !isAnalyzing && !results && (
              <button
                onClick={handleAnalyze}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
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
            
            {!results ? (
              <div className="text-center text-gray-500 py-12">
                <Upload className="mx-auto h-12 w-12" />
                <p className="mt-2">No analysis results yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Diagnosis Summary */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-lg mb-2">Diagnosis Summary</h3>
                  <p className={`text-lg font-medium ${
                    results.abnormalityLevel === 'high' 
                      ? 'text-red-600' 
                      : results.abnormalityLevel === 'medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {results.diagnosis}
                  </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Statistics</h4>
                    <ul className="space-y-2">
                      <li>Total Anomalies: {results.statistics.totalAnomalies}</li>
                      <li>Average Density: {results.statistics.averageDensity.toFixed(1)} HU</li>
                      <li>Critical Locations: {results.statistics.criticalLocations}</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Analysis Time</h4>
                    <p>{(results.executionTime / 1000).toFixed(2)} seconds</p>
                  </div>
                </div>

                {/* Detected Anomalies */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Detected Anomalies</h4>
                  <div className="max-h-60 overflow-y-auto">
                    {results.anomalies.map((anomaly) => (
                      <div key={anomaly.id} className="border-b py-2 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">
                            {anomaly.type.charAt(0).toUpperCase() + anomaly.type.slice(1)}
                          </span>
                          <span className="text-sm">
                            Location: {anomaly.location}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Size: {anomaly.size.toFixed(0)} px² | 
                          Density: {anomaly.hounsfield.toFixed(0)} HU |
                          Characteristics: {anomaly.characteristics.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processed Image */}
                {results.processedImageUrl && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Processed Image</h4>
                    <img
                      src={results.processedImageUrl}
                      alt="Processed"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
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