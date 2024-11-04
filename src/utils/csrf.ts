export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
}; 