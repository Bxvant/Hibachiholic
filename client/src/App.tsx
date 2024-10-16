import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import MenuList from './MenuList';
import Favorites from './Favorites';
import Cart from './Cart';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <h1 className="page-title">Menu</h1>
        <Routes>
          <Route path="/" element={<MenuList />} />
          <Route path="/favorites" element={<Favorites />} />{' '}
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}
