import './MenuItem.css';

type MenuItemProps = {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  menuItemId: number;
  onAddToFavorites: (menuItemId: number) => void;
};

export default function MenuItem({
  title,
  description,
  price,
  imageUrl,
  menuItemId,
  onAddToFavorites,
}: MenuItemProps) {
  return (
    <div className="menu-item">
      <h2 className="item-title">{title}</h2>
      <img src={imageUrl} alt={title} className="item-image" />
      <div className="item-details">
        <p className="item-description">{description}</p>
        <p className="item-price">Price: ${Number(price).toFixed(2)}</p>
        <button onClick={() => onAddToFavorites(menuItemId)}>
          Add to Favorites
        </button>
      </div>
    </div>
  );
}
