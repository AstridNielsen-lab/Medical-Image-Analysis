export type DiagnosisLevel = 'low' | 'medium' | 'high';

export interface AnomalyData {
  id: number;
  type: 'aneurysm' | 'mass' | 'calcification' | 'fluid' | 'other';
  location: string;
  size: number;
  density: number;
  hounsfield: number; // Hounsfield units for CT density
  irregularity: number;
  characteristics: string[];
}

export interface AnalysisStatistics {
  totalAnomalies: number;
  averageDensity: number;
  averageSize: number;
  maxHounsfield: number;
  minHounsfield: number;
  criticalLocations: number;
}

export interface MedicalAnalysisResult {
  anomalies: AnomalyData[];
  statistics: AnalysisStatistics;
  executionTime: number;
  abnormalityLevel: DiagnosisLevel;
  diagnosis: string;
  processedImageUrl: string;
}