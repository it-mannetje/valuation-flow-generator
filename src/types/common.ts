// Common types used across the application

// Base entity interface with common fields
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Common file upload types
export interface FileUpload {
  file: File;
  type: 'image' | 'pdf' | 'document';
  maxSize?: number; // in bytes
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Common error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}