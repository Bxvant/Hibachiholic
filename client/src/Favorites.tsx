import { useEffect, useState } from 'react';
import MenuItem from './MenuItem';

type FavoriteItem = {
  favoriteId: number;
  menuItemId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const addToCart = async (menuItemId: number, quantity: number = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId, quantity }),
      });

      if (!response.ok) throw new Error('Failed to add item to cart');
      console.log('Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromFavorites = async (favoriteId: number) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove favorite');

      setFavorites((prevFavorites) =>
        prevFavorites.filter((item) => item.favoriteId !== favoriteId)
      );
      console.log('Item removed from favorites');
    } catch (error) {
      console.error('Error removing item from favorites:', error);
    }
  };

  return (
    <div className="favorites-list">
      <h2>Your Favorites</h2>
      {favorites.map((item) => (
        <div key={item.favoriteId} className="favorite-item">
          <MenuItem
            menuItemId={item.menuItemId}
            title={item.name}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            onAddToFavorites={() => addToCart(item.menuItemId)}
            onAddToCart={() => addToCart(item.menuItemId, 1)}
          />
          <button onClick={() => removeFromFavorites(item.favoriteId)}>
            Remove from Favorites
          </button>
        </div>
      ))}
    </div>
  );
}
