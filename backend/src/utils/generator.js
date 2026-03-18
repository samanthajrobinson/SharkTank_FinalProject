import { sanitizeArray, sanitizeText } from './sanitize.js';

const baseRecommendations = {
  casual: ['Relaxed denim', 'Soft knit layer', 'Clean everyday sneaker'],
  class: ['Structured basic top', 'Comfortable bottoms', 'Easy backpack-ready shoes'],
  internship: ['Polished top', 'Tailored bottoms', 'Professional footwear'],
  'date-night': ['Statement top', 'Elevated bottom', 'Intentional shoe choice'],
  presentation: ['Confident blazer layer', 'Tailored bottom', 'Dressy finishing shoe']
};

const accessoryMap = {
  classic: ['watch', 'structured tote'],
  streetwear: ['crossbody bag', 'silver chain'],
  soft: ['delicate jewelry', 'card holder'],
  professional: ['portfolio bag', 'simple earrings']
};

export function buildGeneratedOutfit(input) {
  const occasion = sanitizeText(input.occasion);
  const weather = sanitizeText(input.weather);
  const vibe = sanitizeText(input.vibe);
  const selectedItems = sanitizeArray(input.selectedItems);
  const includeLayer = Boolean(input.includeLayer);
  const colorPreference = sanitizeText(input.colorPreference || 'neutrals');
  const name = sanitizeText(input.name || 'Generated Look');

  const recommendations = baseRecommendations[occasion] || baseRecommendations.casual;
  const items = [...selectedItems.slice(0, 3), ...recommendations].slice(0, 5);
  if (includeLayer && !items.some((item) => item.toLowerCase().includes('layer'))) {
    items.push(weather === 'cold' || weather === 'rainy' ? 'Weather-ready layer' : 'Lightweight outer layer');
  }

  return {
    name,
    occasion,
    weather,
    vibe,
    colorPreference,
    description: `A ${vibe} outfit for ${occasion} days with a ${colorPreference} color story and ${weather} weather in mind.`,
    items,
    accessories: accessoryMap[vibe] || ['simple accessory'],
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    favorite: 0,
    createdAt: new Date().toISOString()
  };
}
