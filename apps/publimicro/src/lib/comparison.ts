// Comparison helper functions
export function addToComparison(propertyId: string): boolean {
  try {
    const stored = localStorage.getItem('comparison');
    const ids: string[] = stored ? JSON.parse(stored) : [];
    
    if (ids.includes(propertyId)) {
      return false; // Already in comparison
    }
    
    if (ids.length >= 3) {
      alert('Você pode comparar no máximo 3 propriedades por vez.');
      return false;
    }
    
    ids.push(propertyId);
    localStorage.setItem('comparison', JSON.stringify(ids));
    return true;
  } catch (error) {
    console.error('Error adding to comparison:', error);
    return false;
  }
}

export function removeFromComparison(propertyId: string): void {
  try {
    const stored = localStorage.getItem('comparison');
    const ids: string[] = stored ? JSON.parse(stored) : [];
    const filtered = ids.filter(id => id !== propertyId);
    localStorage.setItem('comparison', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from comparison:', error);
  }
}

export function getComparisonIds(): string[] {
  try {
    const stored = localStorage.getItem('comparison');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting comparison IDs:', error);
    return [];
  }
}

export function clearComparison(): void {
  localStorage.removeItem('comparison');
}

export function getComparisonUrl(): string {
  const ids = getComparisonIds();
  if (ids.length === 0) return '/comparar';
  return `/comparar?ids=${ids.join(',')}`;
}

export function isInComparison(propertyId: string): boolean {
  const ids = getComparisonIds();
  return ids.includes(propertyId);
}
