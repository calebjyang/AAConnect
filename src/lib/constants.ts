// Application constants and configuration

// Firebase Collections
export const FIRESTORE_COLLECTIONS = {
  EVENTS: 'events',
  RIDES: 'rides',
  CONFIG: 'config',
  USERS: 'users',
  APARTMENTS: 'apartments',
  APARTMENT_MEMBERS: 'apartmentMembers',
  AVAILABILITY_SLOTS: 'availabilitySlots',
} as const;

// Firebase Documents
export const FIRESTORE_DOCUMENTS = {
  AFTEREVENT_CONFIG: 'afterevent',
} as const;

// Location Groups for Carpool Algorithm
export const LOCATION_GROUPS = {
  'Middle Earth': ['Middle Earth'],
  'Mesa Court': ['Mesa Court'],
  'UTC': ['Berk', 'Cornell', 'Other UTC (NOT Berk/Cornell)'],
  'ACC': ['Plaza', 'Other ACC (NOT Plaza)'],
  'Other': ['Other']
} as const;

// Location Options for Forms
export const LOCATION_OPTIONS = [
  "Middle Earth",
  "Mesa Court", 
  "Berk",
  "Cornell",
  "Other UTC (NOT Berk/Cornell)",
  "Plaza",
  "Other ACC (NOT Plaza)",
  "Other"
] as const;

// Quarters for Afterevent Week Selection
export const QUARTERS = ['Fall', 'Winter', 'Spring'] as const;

// Weeks for Afterevent Week Selection
export const WEEKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;

// Form Validation
export const VALIDATION = {
  PHONE_REGEX: /^(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_CAPACITY: 1,
  MAX_CAPACITY: 15,
} as const;

// UI Constants
export const UI = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  AUTO_HIDE_DELAY: 5000,
  MAX_EVENTS_DISPLAY: 3,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  ADMIN_VERIFY: '/api/admin/verify',
  EVENTS: '/api/events',
  RIDES: '/api/rides',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTH_ERROR: 'Authentication error. Please sign in again.',
  PERMISSION_DENIED: 'You don\'t have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  FIREBASE_ERROR: 'Database error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Event created successfully!',
  EVENT_UPDATED: 'Event updated successfully!',
  EVENT_DELETED: 'Event deleted successfully!',
  SIGNUP_SAVED: 'Signup saved successfully!',
  SIGNUP_DELETED: 'Signup deleted successfully!',
  WEEK_UPDATED: 'Afterevent week updated successfully!',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  CREATING: 'Creating...',
  UPDATING: 'Updating...',
  DELETING: 'Deleting...',
  SAVING: 'Saving...',
  LOADING: 'Loading...',
  SUBMITTING: 'Submitting...',
} as const;

// File Types
export const FILE_TYPES = {
  CSV: 'text/csv',
  JSON: 'application/json',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM dd, yyyy h:mm a',
  ISO: 'yyyy-MM-dd\'T\'HH:mm',
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/aacf_uci',
  FACEBOOK: 'https://facebook.com/aacf.uci',
  DISCORD: 'https://discord.gg/aacf',
  LINKTREE: 'https://linktr.ee/aacf_uci',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  RIDES: '/events/rides',
  APARTMENTS: '/apartments',
  LOGIN: '/login',
  ADMIN: '/admin',
} as const;

// Environment
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const; 