import { useState, useEffect } from 'react';
import MenuItem from './MenuItem'; // Reuse MenuItem component

type FavoriteItemType = {
  favoriteId: number;
  menuItemId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItemType[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites'); // Fetches favorites from the server
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const data: FavoriteItemType[] = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (favoriteId: number) => {
    if (!favoriteId) {
      console.error('Error: favoriteId is undefined or invalid');
      return;
    }
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove favorite');

      // Update the state to remove the item from the list after deletion
      setFavorites(favorites.filter((item) => item.favoriteId !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="favorites-list">
      <h1>Your Favorites</h1>
      {favorites.length > 0 ? (
        favorites.map((item) => (
          <div key={item.favoriteId} className="favorite-item">
            <MenuItem
              title={item.name}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
              menuItemId={item.menuItemId}
              onAddToFavorites={() => {}} // No action needed here
            />
            <button
              onClick={() => {
                removeFavorite(item.favoriteId),
                  console.log('removed FavoriteId: ', item.favoriteId);
              }}>
              Remove from Favorites
            </button>
          </div>
        ))
      ) : (
        <p>No favorites added yet.</p>
      )}
    </div>
  );
}
