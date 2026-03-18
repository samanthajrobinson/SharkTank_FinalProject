import { useEffect, useMemo, useState } from 'react';
import { useOutfit } from '../context/OutfitContext.jsx';
import { filterOutfits, sortOutfits } from '../utils/outfitHelpers.js';

export default function SavedPage() {
  const { savedOutfits, deleteOutfit, updateOutfit, refreshSavedOutfits, token } = useOutfit();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (token) {
      refreshSavedOutfits().catch(() => {});
    }
  }, [token, refreshSavedOutfits]);

  const visibleOutfits = useMemo(() => {
    const filtered = filterOutfits(savedOutfits, searchTerm);
    return sortOutfits(filtered, sortBy);
  }, [savedOutfits, searchTerm, sortBy]);

  return (
    <main className="container">
      <div className="page-header-row">
        <div>
          <h1>Saved Looks</h1>
          <p>Search, sort, update, and delete saved outfits.</p>
        </div>
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Filter saved looks"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="recent">Newest</option>
            <option value="name">Name</option>
            <option value="occasion">Occasion</option>
          </select>
        </div>
      </div>

      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Occasion</th>
              <th>Weather</th>
              <th>Vibe</th>
              <th>Favorite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleOutfits.length ? (
              visibleOutfits.map((outfit) => (
                <tr key={outfit.id}>
                  <td>{outfit.name}</td>
                  <td>{outfit.occasion}</td>
                  <td>{outfit.weather}</td>
                  <td>{outfit.vibe}</td>
                  <td>{outfit.favorite ? 'Yes' : 'No'}</td>
                  <td className="action-cell">
                    <button onClick={() => updateOutfit(outfit.id, { favorite: !outfit.favorite })}>
                      {outfit.favorite ? 'Unfavorite' : 'Favorite'}
                    </button>
                    <button className="danger-button" onClick={() => deleteOutfit(outfit.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No outfits match your current filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
