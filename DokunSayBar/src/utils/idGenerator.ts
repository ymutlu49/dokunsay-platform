let nextId = 100;

export function generateId(): number {
  return nextId++;
}

export function resetIdCounter(startFrom = 100): void {
  nextId = startFrom;
}
