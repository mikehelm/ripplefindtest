// Validate code format
// Private code: 6 alphanumeric chars, last char must be A-Z or 2/3/4/6/7/9
// Public code: xxx-xxx (3 alnum, dash, 3 alnum), same last char rule
export function isCodeValid(code: string): boolean {
  if (!code) return false;
  
  // Check for public code format (XXX-XXX)
  if (code.includes('-')) {
    const parts = code.split('-');
    return (
      parts.length === 2 &&
      parts[0].length === 3 &&
      parts[1].length === 3 &&
      /^[A-Z0-9]{2}[A-Z0-9]$/i.test(parts[0]) &&
      /^[A-Z0-9]{2}[A-Z2-4679]$/i.test(parts[1])
    );
  }
  
  // Check for private code format (6 chars)
  return (
    code.length === 6 &&
    /^[A-Z0-9]{5}[A-Z2-4679]$/i.test(code)
  );
}
