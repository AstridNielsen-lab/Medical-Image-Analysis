import { MedicalAnalysisResult, CellData, DiagnosisLevel } from '../types/analysis';

export class ImageAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startTime: Date;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.startTime = new Date();
  }

  async analyzeImage(imageFile: File): Promise<MedicalAnalysisResult> {
    this.startTime = new Date();
    console.log("Starting analysis process...");

    // Load image into canvas
    const image = await this.loadImage(imageFile);
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const { data, width, height } = imageData;

    // Convert to grayscale
    const grayscaleData = this.convertToGrayscale(data);
    
    // Find contours (simplified version using threshold)
    const contours = this.findContours(grayscaleData, width, height);
    
    // Analyze cells
    const cellsData = this.analyzeCells(contours, grayscaleData, width);
    
    // Calculate statistics
    const statistics = this.calculateStatistics(cellsData);
    
    const endTime = new Date();
    const executionTime = endTime.getTime() - this.startTime.getTime();

    return {
      cells: cellsData,
      statistics,
      executionTime,
      abnormalityLevel: this.determineAbnormalityLevel(statistics),
      diagnosis: this.generateDiagnosis(statistics),
      processedImageUrl: this.canvas.toDataURL()
    };
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private convertToGrayscale(data: Uint8ClampedArray): Uint8ClampedArray {
    const grayscale = new Uint8ClampedArray(data.length / 4);
    for (let i = 0; i < data.length; i += 4) {
      grayscale[i / 4] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    }
    return grayscale;
  }

  private findContours(
    grayscaleData: Uint8ClampedArray,
    width: number,
    height: number
  ): Array<{ x: number; y: number; width: number; height: number }> {
    const threshold = 128;
    const contours: Array<{ x: number; y: number; width: number; height: number }> = [];
    
    // Simplified contour detection using threshold
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const idx = y * width + x;
        if (grayscaleData[idx] > threshold) {
          // Found a potential cell
          let cellWidth = 1;
          let cellHeight = 1;
          
          // Grow region
          while (
            x + cellWidth < width &&
            grayscaleData[idx + cellWidth] > threshold
          ) {
            cellWidth++;
          }
          
          while (
            y + cellHeight < height &&
            grayscaleData[idx + cellHeight * width] > threshold
          ) {
            cellHeight++;
          }
          
          if (cellWidth > 5 && cellHeight > 5) { // Minimum size threshold
            contours.push({ x, y, width: cellWidth, height: cellHeight });
          }
          
          x += cellWidth; // Skip processed pixels
        }
      }
    }
    
    return contours;
  }

  private analyzeCells(
    contours: Array<{ x: number; y: number; width: number; height: number }>,
    grayscaleData: Uint8ClampedArray,
    width: number
  ): CellData[] {
    return contours.map((contour, index) => {
      const area = contour.width * contour.height;
      const perimeter = 2 * (contour.width + contour.height);
      const colorDifference = this.calculateColorDifference(
        contour,
        grayscaleData,
        width
      );

      return {
        id: index + 1,
        size: area,
        shape: this.calculateShapeComplexity(contour),
        colorDifference,
        abnormalities: this.detectAbnormalities(area, colorDifference)
      };
    });
  }

  private calculateColorDifference(
    contour: { x: number; y: number; width: number; height: number },
    grayscaleData: Uint8ClampedArray,
    width: number
  ): number {
    let sum = 0;
    let count = 0;

    for (let y = contour.y; y < contour.y + contour.height; y++) {
      for (let x = contour.x; x < contour.x + contour.width; x++) {
        sum += grayscaleData[y * width + x];
        count++;
      }
    }

    return count > 0 ? sum / count : 0;
  }

  private calculateShapeComplexity(
    contour: { width: number; height: number }
  ): number {
    return Math.abs(contour.width - contour.height) / Math.max(contour.width, contour.height);
  }

  private detectAbnormalities(area: number, colorDifference: number): string[] {
    const abnormalities: string[] = [];
    
    if (area > 1000) abnormalities.push('hipertrofia');
    if (area < 100) abnormalities.push('hipotrofia');
    if (colorDifference > 200) abnormalities.push('acúmulos intracelulares');
    
    return abnormalities;
  }

  private calculateStatistics(cells: CellData[]) {
    const totalCells = cells.length;
    const abnormalCells = cells.filter(cell => cell.abnormalities.length > 0).length;
    const averageSize = cells.reduce((sum, cell) => sum + cell.size, 0) / totalCells;

    return {
      totalCells,
      abnormalCells,
      abnormalityPercentage: (abnormalCells / totalCells) * 100,
      averageSize
    };
  }

  private determineAbnormalityLevel(statistics: {
    abnormalityPercentage: number;
  }): DiagnosisLevel {
    if (statistics.abnormalityPercentage > 30) return 'high';
    if (statistics.abnormalityPercentage > 10) return 'medium';
    return 'low';
  }

  private generateDiagnosis(statistics: {
    abnormalityPercentage: number;
  }): string {
    if (statistics.abnormalityPercentage > 30) {
      return 'Anomalia Grave Detectada - Recomenda-se avaliação médica imediata';
    }
    if (statistics.abnormalityPercentage > 10) {
      return 'Anomalia Moderada Detectada - Recomenda-se acompanhamento médico';
    }
    return 'Nenhuma anomalia significativa detectada';
  }
}