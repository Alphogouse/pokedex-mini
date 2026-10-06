import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="shell">
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="app">
        <header className="app-header">
          <Link to="/" className="app-title-link">
            <span className="brand-ball" />
            <h1>PokéDex Mini</h1>
          </Link>
          <nav className="app-nav">
            <Link to="/">Pokédex</Link>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
