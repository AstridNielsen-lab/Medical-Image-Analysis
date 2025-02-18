export type DiagnosisLevel = 'low' | 'medium' | 'high';

export interface CellData {
  id: number;
  size: number;
  shape: number;
  colorDifference: number;
  abnormalities: string[];
}

export interface AnalysisStatistics {
  totalCells: number;
  abnormalCells: number;
  abnormalityPercentage: number;
  averageSize: number;
}

export interface MedicalAnalysisResult {
  cells: CellData[];
  statistics: AnalysisStatistics;
  executionTime: number;
  abnormalityLevel: DiagnosisLevel;
  diagnosis: string;
  processedImageUrl: string;
}