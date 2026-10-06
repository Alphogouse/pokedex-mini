import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { getIdFromUrl, capitalize, getSpriteUrl } from "../utils.js";
import TypeBadge from "./TypeBadge.jsx";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    async function loadPokemons() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=20`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        // the list endpoint has no types, so fetch each detail once
        const withTypes = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            const detail = await res.json();
            return { ...p, types: detail.types.map((t) => t.type.name) };
          })
        );
        setPokemons(withTypes);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadPokemons();
  }, []);

  if (isLoading) {
    return <p className="status">Loading Pokémon…</p>;
  }
  if (error) {
    return <p className="status status-error">Couldn't load the list: {error}</p>;
  }

  const allTypes = [...new Set(pokemons.flatMap((p) => p.types))].sort();
  const visible =
    activeType === "all" ? pokemons : pokemons.filter((p) => p.types.includes(activeType));

  return (
    <>
    <div className="type-filter">
      {["all", ...allTypes].map((t) => (
        <button
          key={t}
          type="button"
          className={t === activeType ? "filter-btn active" : "filter-btn"}
          onClick={() => setActiveType(t)}
        >
          {t}
        </button>
      ))}
    </div>
    <ul className="pokemon-list">
      {visible.map((pokemon) => {
        const id = getIdFromUrl(pokemon.url);
        return (
          <li key={pokemon.name} className="pokemon-list-item">
            <Link to={`/pokemon/${pokemon.name}`} className="pokemon-link">
              <img
                className="pokemon-sprite"
                src={getSpriteUrl(id)}
                alt={pokemon.name}
                width={64}
                height={64}
              />
              <span className="pokemon-info">
                <span className="pokemon-name">{capitalize(pokemon.name)}</span>
                <span className="pokemon-meta">
                  <span className="pokemon-id">#{id.padStart(3, "0")}</span>
                  {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
                </span>
              </span>
              <span className="pokemon-arrow">›</span>
            </Link>
          </li>
        );
      })}
    </ul>
    </>
  );
}

export default PokemonList;
