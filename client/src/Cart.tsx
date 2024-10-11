import React, { useEffect, useState } from 'react';
import './Cart.css';

interface CartItem {
  cartId: number;
  name: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart items');
      const data = await response.json();
      setCartItems(data);
      calculateTotal(data);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  };
  /*
  const addToCart = async (menuItemId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId, quantity: 1 }), // Default quantity to 1
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      await fetchCartItems(); // Refresh the cart items after adding
    } catch (error) {
      console.error(error);
    }
  };
  */

  const updateQuantity = async (cartId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      await fetchCartItems(); // Refresh the cart items after updating
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
      await fetchCartItems(); // Refresh the cart items after removing
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.cartId} className="cart-item">
          <span>{item.name}</span>
          <span>Quantity: {item.quantity}</span>
          <span>Price: ${item.price}</span>
          <button
            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>
            +
          </button>
          <button
            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => removeFromCart(item.cartId)}>Remove</button>
        </div>
      ))}
      <div className="total">Total: ${total}</div>
    </div>
  );
};

export default Cart;
