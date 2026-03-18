export const wardrobeCatalog = [
  'Blazer',
  'Cardigan',
  'Cropped Tee',
  'Dress Pants',
  'Jeans',
  'Loafers',
  'Midi Skirt',
  'Sneakers',
  'Structured Coat',
  'White Button-Up'
];

export function validateForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Please enter a look name.';
  if (!form.occasion) errors.occasion = 'Choose an occasion.';
  if (!form.weather) errors.weather = 'Choose the weather.';
  if (!form.vibe) errors.vibe = 'Choose a style vibe.';
  if (form.selectedItems.length < 2) errors.selectedItems = 'Pick at least two closet items.';
  return errors;
}

export function buildTags(outfit) {
  return [outfit.occasion, outfit.weather, outfit.vibe].filter(Boolean).join(' • ');
}

export function sortOutfits(outfits, sortBy) {
  const copy = [...outfits];
  if (sortBy === 'occasion') {
    return copy.sort((a, b) => a.occasion.localeCompare(b.occasion));
  }
  if (sortBy === 'name') {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  return copy.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export function filterOutfits(outfits, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return outfits;
  return outfits.filter((outfit) => {
    const haystack = [
      outfit.name,
      outfit.occasion,
      outfit.weather,
      outfit.vibe,
      ...(outfit.items || []),
      ...(outfit.accessories || [])
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(term);
  });
}
