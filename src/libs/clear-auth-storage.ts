export function clearAuthStorage() {
  if (typeof window === 'undefined') {
    console.warn('This function only works in browser environment');
    return;
  }

  console.log(" Cleaning up authentication storage...");

  const beforeKeys = Object.keys(localStorage);
  console.log(' Keys before cleanup:', beforeKeys);

  const keysToRemove = [
    'access-token',
    'accessToken',
    'refreshToken',
    'token',
    'auth-storage',
    'torisho_access_token',
    'torisho_user',
  ];

  let removedCount = 0;
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      removedCount++;
      console.log(`✅ Removed: ${key}`);
    }
  });

  const afterKeys = Object.keys(localStorage);
  console.log(' Keys after cleanup:', afterKeys);
  console.log(` Cleanup complete! Removed ${removedCount} keys.`);
}

// Make available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as { clearAuthStorage: typeof clearAuthStorage }).clearAuthStorage = clearAuthStorage;
  console.log(' Tip: Run clearAuthStorage() in console to clear auth data');
}
