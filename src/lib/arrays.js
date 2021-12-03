export function sortBy(prop) {
  return (a, b) => (a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0);
}

export function unique(arr) {
  return [...new Set(arr)];
}
