export enum QRMode {
  MANUAL = 'MANUAL',
  AI = 'AI'
}

export enum QRErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H'
}

export interface QRSettings {
  value: string;
  fgColor: string;
  bgColor: string;
  level: QRErrorCorrectionLevel;
  size: number;
  includeMargin: boolean;
}

export interface GenerationHistoryItem {
  id: string;
  value: string;
  type: string;
  timestamp: number;
}