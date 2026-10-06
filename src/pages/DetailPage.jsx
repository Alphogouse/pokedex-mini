import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize } from "../utils.js";
import TypeBadge from "../components/TypeBadge.jsx";

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }
        const data = await response.json();
        if (isCurrent) {
          setPokemon(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadPokemon();

    return () => {
      isCurrent = false;
    };
  }, [name]);

  if (isLoading) return <p className="status">Loading {name}…</p>;
  if (error) return <p className="status status-error">{error}</p>;

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Back to list</Link>
      <div className="detail-art"><img
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={pokemon.name}
        width={200}
        height={200}
      /></div>
      <h2>{capitalize(pokemon.name)}</h2>
      <div className="detail-types">
        {pokemon.types.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
      </div>
      <ul className="stat-list">
        {pokemon.stats.map((s) => (
          <li key={s.stat.name}>
            <span className="stat-name">{s.stat.name}</span>
            <span className="stat-value">{s.base_stat}</span>
            <span className="stat-bar"><span style={{ width: `${Math.min(s.base_stat / 2, 100)}%` }} /></span>
          </li>
        ))}
      </ul>
      <div className="detail-nav">
        {pokemon.id > 1 ? (
          <Link to={`/pokemon/${pokemon.id - 1}`} className="nav-btn">← Previous</Link>
        ) : <span />}
        <Link to={`/pokemon/${pokemon.id + 1}`} className="nav-btn">Next →</Link>
      </div>
    </div>
  );
}

export default DetailPage;
