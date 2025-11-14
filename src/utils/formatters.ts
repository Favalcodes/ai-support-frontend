import { formatDistanceToNow, format } from 'date-fns';

// Format date to relative time (e.g., "2 minutes ago")
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Format date to specific format
export const formatDate = (date: string | Date, dateFormat = 'PPP'): string => {
  return format(new Date(date), dateFormat);
};

// Format time only
export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'p');
};

// Format full date and time
export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'PPP p');
};

// Get initials from name
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};