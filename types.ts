
export enum DocType {
  CIN = 'CIN',
  DRIVING_LICENSE = 'Driving License',
  VEHICLE_REGISTRATION = 'Vehicle Registration',
  UNKNOWN = 'Unknown'
}

export interface User {
  email: string;
  name: string;
  avatar?: string;
}

export interface ExtractedData {
  documentType: DocType;
  fullName?: string;
  idNumber?: string;
  birthDate?: string;
  expiryDate?: string;
  address?: string;
  additionalInfo?: Record<string, string>;
  confidence: number;
}

export interface DocumentRecord {
  id: string;
  timestamp: Date;
  imageUrl: string; // Used for both image data-url and PDF preview
  mimeType: string;
  fileName: string;
  extractedData: ExtractedData;
  status: 'pending' | 'completed' | 'failed';
}
