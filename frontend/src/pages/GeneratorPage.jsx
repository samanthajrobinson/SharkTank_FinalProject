import { useState } from 'react';
import OutfitForm from '../components/OutfitForm.jsx';
import OutfitCard from '../components/OutfitCard.jsx';
import { useOutfit } from '../context/OutfitContext.jsx';

export default function GeneratorPage() {
  const { createOutfit, lastGeneratedOutfit, saveOutfit } = useOutfit();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async (form) => {
    setLoading(true);
    setMessage('');
    try {
      await createOutfit(form);
      setMessage('Your new outfit is ready.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (outfit) => {
    try {
      await saveOutfit(outfit);
      setMessage('Outfit saved successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="container page-grid">
      <section>
        <h1>Outfit Generator</h1>
        <p>Choose the occasion, weather, and vibe. FitMatch will build a coordinated look from those choices.</p>
        <OutfitForm onGenerate={handleGenerate} loading={loading} />
        {message ? <p className="status-message">{message}</p> : null}
      </section>

      <section>
        <h2>Generated Result</h2>
        {lastGeneratedOutfit ? (
          <OutfitCard outfit={lastGeneratedOutfit} onSave={handleSave} showSaveButton />
        ) : (
          <article className="card">
            <p>Your generated outfit will appear here after you submit the form.</p>
          </article>
        )}
      </section>
    </main>
  );
}
