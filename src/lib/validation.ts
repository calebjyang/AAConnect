// Centralized validation utilities for AAConnect

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Phone number validation (US format)
export function validatePhone(phone: string): ValidationError | null {
  const phoneRegex = /^(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  if (!phoneRegex.test(phone)) {
    return {
      field: 'phone',
      message: 'Please enter a valid US phone number'
    };
  }
  return null;
}

// Email validation
export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: 'Please enter a valid email address'
    };
  }
  return null;
}

// Required field validation
export function validateRequired(value: string, fieldName: string): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    };
  }
  return null;
}

// Capacity validation for drivers
export function validateCapacity(capacity: string, canDrive: string): ValidationError | null {
  if (canDrive === 'yes') {
    if (!capacity || capacity.trim().length === 0) {
      return {
        field: 'capacity',
        message: 'Capacity is required for drivers'
      };
    }
    const numCapacity = parseInt(capacity);
    if (isNaN(numCapacity) || numCapacity < 1) {
      return {
        field: 'capacity',
        message: 'Capacity must be a positive number'
      };
    }
  }
  return null;
}

// URL validation
export function validateUrl(url: string, fieldName: string): ValidationError | null {
  if (url && url.trim().length > 0) {
    try {
      new URL(url);
    } catch {
      return {
        field: fieldName,
        message: 'Please enter a valid URL'
      };
    }
  }
  return null;
}

// Date validation
export function validateDate(date: string, fieldName: string): ValidationError | null {
  if (!date || date.trim().length === 0) {
    return {
      field: fieldName,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return {
      field: fieldName,
      message: 'Please enter a valid date'
    };
  }
  
  return null;
}

// Carpool signup validation
export function validateCarpoolSignup(data: {
  name: string;
  phone: string;
  canDrive: string;
  capacity?: string;
  location: string;
  aftereventWeek: string;
}): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Required fields
  const requiredFields = [
    { field: 'name', value: data.name },
    { field: 'phone', value: data.phone },
    { field: 'location', value: data.location },
    { field: 'aftereventWeek', value: data.aftereventWeek }
  ];
  
  requiredFields.forEach(({ field, value }) => {
    const error = validateRequired(value, field);
    if (error) errors.push(error);
  });
  
  // Phone validation
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.push(phoneError);
  
  // Capacity validation
  const capacityError = validateCapacity(data.capacity || '', data.canDrive);
  if (capacityError) errors.push(capacityError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Event validation
export function validateEvent(data: {
  title: string;
  date: string;
  location: string;
  rsvpUrl?: string;
  ridesUrl?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Required fields
  const requiredFields = [
    { field: 'title', value: data.title },
    { field: 'date', value: data.date },
    { field: 'location', value: data.location }
  ];
  
  requiredFields.forEach(({ field, value }) => {
    const error = validateRequired(value, field);
    if (error) errors.push(error);
  });
  
  // Date validation
  const dateError = validateDate(data.date, 'date');
  if (dateError) errors.push(dateError);
  
  // URL validations
  if (data.rsvpUrl) {
    const rsvpError = validateUrl(data.rsvpUrl, 'rsvpUrl');
    if (rsvpError) errors.push(rsvpError);
  }
  
  if (data.ridesUrl) {
    const ridesError = validateUrl(data.ridesUrl, 'ridesUrl');
    if (ridesError) errors.push(ridesError);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Format validation errors for display
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(error => error.message).join('. ');
}

// Get first error for a specific field
export function getFieldError(errors: ValidationError[], fieldName: string): string | null {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : null;
} 