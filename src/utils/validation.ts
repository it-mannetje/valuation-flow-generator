import { ValidationResult } from '@/types/common';

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Dutch format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+31|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Required field validation
export const validateRequired = (value: string | number | undefined | null): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value) && value >= 0;
  return value !== undefined && value !== null;
};

// Validate multiple fields
export const validateFields = (
  fields: Record<string, unknown>,
  validators: Record<string, (value: unknown) => boolean>
): ValidationResult => {
  const errors: string[] = [];
  
  Object.entries(validators).forEach(([fieldName, validator]) => {
    const value = fields[fieldName];
    if (!validator(value)) {
      errors.push(`${fieldName} is invalid`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// File validation
export const validateFile = (file: File, maxSizeBytes: number = 5 * 1024 * 1024): ValidationResult => {
  const errors: string[] = [];
  
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`);
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type. Only JPEG, PNG, WebP and PDF files are allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};