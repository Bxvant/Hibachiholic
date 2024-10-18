import { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './MenuList.css';

type MenuItemType = {
  menuItemId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function MenuList() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menuItems');
        if (!response.ok) throw new Error('response is not ok');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddToFavorites = async (menuItemId: number) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId }), // Pass the menuItemId to save
      });
      if (!response.ok) throw new Error('Failed to add to favorites');
      alert('Item added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const handleAddToCart = async (menuItemId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="menu-list">
      {menuItems.map((item) => (
        <MenuItem
          key={item.menuItemId}
          title={item.name}
          description={item.description}
          price={item.price}
          imageUrl={item.imageUrl}
          menuItemId={item.menuItemId}
          onAddToFavorites={handleAddToFavorites}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
