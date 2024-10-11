import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="nav-bar">
      {/* Logo on the left */}
      <div className="nav-left">
        <p className="logoName">HibachiHolic</p>
      </div>

      {/* Links on the right */}
      <div className="nav-right">
        <Link to="/" className="nav-link">
          Menu
        </Link>
        <Link to="/favorites" className="nav-link">
          Favorites
        </Link>
        <a href="#" className="nav-link">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
            alt="Cart"
            className="cart-icon"
          />
        </a>
      </div>
    </nav>
  );
}
