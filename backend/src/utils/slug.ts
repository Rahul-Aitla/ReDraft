export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateUniqueSlug(baseSlug: string, index: number = 0): string {
  if (index === 0) return baseSlug;
  return `${baseSlug}-${index}`;
}
