// Application-wide constants

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  PDF: 10 * 1024 * 1024,  // 10MB
  DOCUMENT: 5 * 1024 * 1024 // 5MB
} as const;

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  PDF: ['application/pdf'],
  DOCUMENT: ['application/pdf', 'text/plain', 'application/msword']
} as const;

// Default values for forms
export const DEFAULT_VALUES = {
  REVENUE_MIN: 1,
  REVENUE_MAX: 10_000_000_000,
  EMPLOYEES_MIN: 1,
  EMPLOYEES_MAX: 1_000_000,
  EBITDA_MIN: 1,
  EBITDA_MAX: 1_000_000_000
} as const;

// PDF generation settings
export const PDF_SETTINGS = {
  PAGE_SIZES: ['A4', 'Letter'] as const,
  MARGINS: {
    TOP: 40,
    BOTTOM: 40,
    LEFT: 40,
    RIGHT: 40
  },
  FONTS: {
    DEFAULT: 'Helvetica',
    HEADING: 'Helvetica-Bold'
  }
} as const;

// API endpoints
export const API_ENDPOINTS = {
  SECTORS: '/api/sectors',
  VALUATIONS: '/api/valuations',
  PDF_PAGES: '/api/pdf-pages'
} as const;