import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import MenuList from './MenuList';
import Favorites from './Favorites'; // Import the Favorites component
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
        </Routes>
      </div>
    </Router>
  );
}
