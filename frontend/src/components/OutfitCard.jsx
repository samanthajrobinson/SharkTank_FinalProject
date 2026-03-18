import { buildTags } from '../utils/outfitHelpers.js';

export default function OutfitCard({ outfit, onSave, showSaveButton = false }) {
  return (
    <article className="card outfit-card">
      <img
        src={outfit.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'}
        alt={`${outfit.name} outfit inspiration`}
        className="outfit-image"
      />
      <div className="outfit-copy">
        <p className="eyebrow">{buildTags(outfit)}</p>
        <h3>{outfit.name}</h3>
        <p>{outfit.description}</p>
        <ul className="pill-list">
          {(outfit.items || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {outfit.accessories?.length ? (
          <p>
            <strong>Accessories:</strong> {outfit.accessories.join(', ')}
          </p>
        ) : null}
        {showSaveButton ? (
          <button onClick={() => onSave(outfit)}>Save Outfit</button>
        ) : null}
      </div>
    </article>
  );
}
