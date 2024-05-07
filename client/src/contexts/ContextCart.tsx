import React, {createContext, ReactNode, useContext, useState, useEffect, useCallback, useMemo} from 'react';
import { Product } from "../interfaces/Product";

const CartContext = createContext<any>(null);

export const useCart = () => {
  return useContext(CartContext);
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [cartTotalAmount, setCartTotalAmount] = useState<number>(0);

  useEffect(() => {
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    setCartTotalAmount(total);
  }, [cart]);

  const addProductToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingProductIndex !== -1) {
        return prevCart.map((item, index) =>
          index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeProductFromCart = useCallback((productId: number) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === productId
      );

      if (existingProductIndex !== -1) {
        return prevCart.map((item, index) => {
          if (index === existingProductIndex) {
            return {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 0,
            };
          }
          return item;
        }).filter(item => item.quantity > 0);
      }
      return prevCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const contextValue = useMemo(() => ({
    cart,
    cartTotalAmount,
    addProductToCart,
    removeProductFromCart,
    clearCart
  }), [cart, cartTotalAmount, addProductToCart, removeProductFromCart, clearCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
