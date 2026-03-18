import { describe, expect, test } from 'vitest';
import { buildTags, filterOutfits, sortOutfits, validateForm } from '../utils/outfitHelpers.js';

describe('outfitHelpers', () => {
  test('validateForm returns errors for missing required fields', () => {
    const errors = validateForm({ name: '', occasion: '', weather: '', vibe: '', selectedItems: [] });
    expect(errors.name).toBeTruthy();
    expect(errors.selectedItems).toBeTruthy();
  });

  test('buildTags creates a display string', () => {
    expect(buildTags({ occasion: 'casual', weather: 'cold', vibe: 'classic' })).toBe('casual • cold • classic');
  });

  test('sortOutfits sorts by name', () => {
    const outfits = [{ name: 'B Look' }, { name: 'A Look' }];
    expect(sortOutfits(outfits, 'name')[0].name).toBe('A Look');
  });

  test('filterOutfits matches on items and metadata', () => {
    const outfits = [{ name: 'Campus Style', occasion: 'class', items: ['Jeans'], accessories: [] }];
    expect(filterOutfits(outfits, 'jeans')).toHaveLength(1);
  });

  test('filterOutfits returns all outfits for an empty search', () => {
    const outfits = [{ name: 'One' }, { name: 'Two' }];
    expect(filterOutfits(outfits, '')).toHaveLength(2);
  });
});
