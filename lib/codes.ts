export function isPrivateCode(code: string) {
  // exactly 6 alnum; last char A–Z or 2/3/4/6/7/9
  return /^[A-Za-z0-9]{5}[A-Z234679]$/.test(code);
}
export function isPublicCode(code: string) {
  // xxx-xxx; last char A–Z or 2/3/4/6/7/9
  return /^[A-Za-z0-9]{3}-[A-Za-z0-9]{2}[A-Z234679]$/.test(code);
}
export function isAnyCode(code: string) {
  return isPrivateCode(code) || isPublicCode(code);
}
