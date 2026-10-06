import SearchForm from "../components/SearchForm.jsx";
import PokemonList from "../components/PokemonList.jsx";

function ListPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h2 className="hero-title">Catch<br />Them All</h2>
          <p className="hero-sub">Search any Pokémon by name and see its types and base stats.</p>
          <SearchForm />
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="pokeball"><span /></div>
        </div>
      </section>
      <h3 className="section-label">Featured Pokémon</h3>
      <PokemonList />
    </>
  );
}

export default ListPage;
