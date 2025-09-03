import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateShareUrl = (referralCode: string, baseUrl?: string): string => {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ripplefind.com');
  return `${base}/?ref=${referralCode}`;
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Date utilities
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Local storage utilities (client-side only)
export const getFromStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const setInStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Handle storage errors silently
  }
};

export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Handle storage errors silently
  }
};

// URL path parsing for names
export interface ParsedNames {
  inviterFirstName: string;
  inviterLastName: string;
  invitedFirstName: string;
  invitedLastName: string;
  inviterFullName: string;
  invitedFullName: string;
}

/**
 * Helper function to capitalize the first letter of a string.
 */
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Helper function to format a URL slug (e.g., "john-doe" to "John Doe")
 * and extract first, last, and full names.
 */
const formatSlugToName = (slug: string): { firstName: string; lastName: string; fullName: string } => {
  const parts = slug.split('-');
  const firstName = capitalizeFirstLetter(parts[0]);
  // Join remaining parts for last name and capitalize
  const lastName = parts.length > 1 ? capitalizeFirstLetter(parts.slice(1).join('-')) : '';
  const fullName = `${firstName} ${lastName}`.trim();
  return { firstName, lastName, fullName };
};

/**
 * Extracts inviter and invited names from the URL path.
 * Expected URL format: /inviter-first-name-inviter-last-name/invited-first-name-invited-last-name
 */
export const getNamesFromUrlPath = (path?: string): ParsedNames => {
  const defaultNames: ParsedNames = {
    inviterFirstName: 'Mike',
    inviterLastName: 'Helm',
    invitedFirstName: 'XXX',
    invitedLastName: 'KAS-Angel',
    inviterFullName: 'Mike Helm',
    invitedFullName: 'XXX KAS-Angel',
  };

  // Determine the path to parse
  let targetPath = path;
  if (typeof window !== 'undefined' && !targetPath) {
    targetPath = window.location.pathname;
  } else if (!targetPath) {
    // If no path is provided and not in a browser environment, return defaults
    return defaultNames;
  }

  // Split the path into segments and filter out any empty strings
  // Example: "/mike-helm/graham-brain" -> ["mike-helm", "graham-brain"]
  const segments = targetPath.split('/').filter(s => s);

  // We expect exactly two segments: one for the inviter and one for the invited person
  if (segments.length === 2) {
    const [inviterSlug, invitedSlug] = segments;

    const inviter = formatSlugToName(inviterSlug);
    const invited = formatSlugToName(invitedSlug);

    return {
      inviterFirstName: inviter.firstName,
      inviterLastName: inviter.lastName,
      invitedFirstName: invited.firstName,
      invitedLastName: invited.lastName,
      inviterFullName: inviter.fullName,
      invitedFullName: invited.fullName,
    };
  }

  // Return default names if the URL format doesn't match the expected pattern
  return defaultNames;
};
