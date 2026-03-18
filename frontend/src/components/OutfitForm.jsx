import { useState } from 'react';
import { validateForm, wardrobeCatalog } from '../utils/outfitHelpers.js';

const initialForm = {
  name: '',
  occasion: 'casual',
  weather: 'mild',
  vibe: 'classic',
  colorPreference: 'neutrals',
  includeLayer: true,
  selectedItems: ['Jeans', 'White Button-Up']
};

export default function OutfitForm({ onGenerate, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleItem = (item) => {
    setForm((current) => ({
      ...current,
      selectedItems: current.selectedItems.includes(item)
        ? current.selectedItems.filter((existing) => existing !== item)
        : [...current.selectedItems, item]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    await onGenerate({
      ...form,
      selectedItems: form.selectedItems
    });
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Look Name</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Coffee Date Uniform"
        />
        {errors.name ? <p className="error-text">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="occasion">Occasion</label>
        <select id="occasion" value={form.occasion} onChange={(event) => updateField('occasion', event.target.value)}>
          <option value="casual">Casual</option>
          <option value="class">Class</option>
          <option value="internship">Internship</option>
          <option value="date-night">Date Night</option>
          <option value="presentation">Presentation</option>
        </select>
      </div>

      <div>
        <label htmlFor="weather">Weather</label>
        <select id="weather" value={form.weather} onChange={(event) => updateField('weather', event.target.value)}>
          <option value="cold">Cold</option>
          <option value="mild">Mild</option>
          <option value="warm">Warm</option>
          <option value="rainy">Rainy</option>
        </select>
      </div>

      <fieldset>
        <legend>Style Vibe</legend>
        <div className="radio-group">
          {['classic', 'streetwear', 'soft', 'professional'].map((vibe) => (
            <label key={vibe}>
              <input
                type="radio"
                name="vibe"
                checked={form.vibe === vibe}
                onChange={() => updateField('vibe', vibe)}
              />
              {vibe}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="colorPreference">Color Story</label>
        <input
          id="colorPreference"
          type="text"
          value={form.colorPreference}
          onChange={(event) => updateField('colorPreference', event.target.value)}
          placeholder="Neutrals, emerald, espresso"
        />
      </div>

      <fieldset className="checkbox-grid">
        <legend>Available Closet Items</legend>
        {wardrobeCatalog.map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={form.selectedItems.includes(item)}
              onChange={() => toggleItem(item)}
            />
            {item}
          </label>
        ))}
        {errors.selectedItems ? <p className="error-text full-width">{errors.selectedItems}</p> : null}
      </fieldset>

      <label className="inline-checkbox">
        <input
          type="checkbox"
          checked={form.includeLayer}
          onChange={(event) => updateField('includeLayer', event.target.checked)}
        />
        Add a layer recommendation
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Generating…' : 'Generate Outfit'}
      </button>
    </form>
  );
}
