/**
 * Utility functions for handling Date objects in localStorage
 */

/**
 * Recursively converts ISO 8601 date strings back to Date objects
 */
export function reviveDates(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If the object is already a Date instance, return it directly
  if (obj instanceof Date) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => reviveDates(item));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const revivedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        // Check if the value is a string that looks like an ISO 8601 date
        if (typeof value === 'string' && isISODateString(value)) {
          revivedObj[key] = new Date(value);
        } else {
          revivedObj[key] = reviveDates(value);
        }
      }
    }
    return revivedObj;
  }

  // Return primitive values as-is
  return obj;
}

/**
 * Checks if a string is a valid ISO 8601 date string
 */
function isISODateString(value: string): boolean {
  // ISO 8601 date pattern (basic check)
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  
  if (!isoDatePattern.test(value)) {
    return false;
  }

  // Additional validation: try to parse the date
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(value.substring(0, 19));
}