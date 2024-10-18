import { useEffect, useState } from 'react';
import './Cart.css';

type CartItem = {
  cartId: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const items = await response.json();
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total price whenever cartItems change
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleRemove = async (cartId: number) => {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item');
      setCartItems(cartItems.filter((item) => item.cartId !== cartId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleQuantityChange = async (cartId: number, quantity: number) => {
    if (quantity < 1) return;

    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');

      const updatedItem = await response.json();

      // Update the cart state with the new quantity
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartId === updatedItem.cartId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-items">
          {cartItems.map((item) => (
            <li key={item.cartId} className="cart-item">
              <p>{item.name}</p>
              <p>Price: ${item.price.toFixed(2)}</p>

              <div className="quantity-control">
                <button
                  onClick={() =>
                    handleQuantityChange(item.cartId, item.quantity - 1)
                  }>
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.cartId,
                      parseInt(e.target.value) || item.quantity
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item.cartId, item.quantity + 1)
                  }>
                  +
                </button>
              </div>

              <button onClick={() => handleRemove(item.cartId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <div className="cart-total">
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}
