import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";
export const useCart = () => {
  const initialCart = () => {
    const dataLocal = localStorage.getItem("cart");
    return dataLocal ? JSON.parse(dataLocal) : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MAX_ITEMS = 5;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    const itemExist = cart.findIndex((el) => el.id === item.id);
    if (itemExist >= 0) {
      if (cart[itemExist].quantity === MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart((prevCart) => [...prevCart, item]);
    }
  }

  function removeFromCart(idItemToRemove) {
    // const updatedCart = cart.filter((item) => item.id !== idItemToRemove);
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== idItemToRemove)
    );
  }

  function increaseQuantity(id) {
    const newQuantity = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    setCart(newQuantity);
  }

  function decreaseQuantity(id) {
    const newQuantity = cart.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }

      return item;
    });

    setCart(newQuantity);
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );
  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
};
