import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Añadimos severidad para los mensajes
  const router = useRouter();
  
  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          setCart([]);
        }
      }
    }
  }, []);
  
  // Guardar el carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);
  
  // Calcular el conteo del carrito para el NavBar
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Función para obtener la cantidad de un producto en el carrito
  const getProductQuantityInCart = (productId) => {
    const product = cart.find(item => item.id === productId);
    return product ? product.quantity || 1 : 0;
  };
  
  // Función para calcular el stock disponible real
  const getAvailableStock = (product) => {
    const quantityInCart = getProductQuantityInCart(product.id);
    return product.stock - quantityInCart;
  };
  
  const addToCart = (product) => {
    // Verificar si el producto ya existe en el carrito por su ID
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
    // Calcular el stock disponible (stock total - cantidad en carrito)
    const availableStock = getAvailableStock(product);
  
    // Verificar si hay stock disponible
    if (availableStock <= 0) {
      setSnackbarMessage(`Lo sentimos, no hay más unidades disponibles de ${product.name}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    if (existingProductIndex >= 0) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      const updatedCart = [...cart];
      const currentQuantity = updatedCart[existingProductIndex].quantity || 1;
  
      // Verificar que no exceda el stock disponible
      if (currentQuantity + product.quantity > product.stock) {
        updatedCart[existingProductIndex].quantity = product.stock; // Ajustar al máximo disponible
        setCart(updatedCart);
        setSnackbarMessage(`Cantidad ajustada: Solo hay ${product.stock} unidades disponibles de ${product.name}`);
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }
  
      updatedCart[existingProductIndex].quantity += product.quantity; // Sumar la cantidad seleccionada
      setCart(updatedCart);
    } else {
      // Si es un producto nuevo, añadirlo al carrito con la cantidad seleccionada
      const adjustedQuantity = product.quantity > product.stock ? product.stock : product.quantity;
      setCart([...cart, { ...product, quantity: adjustedQuantity }]);
  
      if (product.quantity > product.stock) {
        setSnackbarMessage(`Cantidad ajustada: Solo hay ${product.stock} unidades disponibles de ${product.name}`);
        setSnackbarSeverity('warning');
      } else {
        setSnackbarMessage(`${product.name} añadido al carrito`);
        setSnackbarSeverity('success');
      }
      setSnackbarOpen(true);
    }
  };
  
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    setSnackbarMessage('Producto eliminado del carrito');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  const updateQuantity = (productId, newQuantity, maxStock) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Verificar que la nueva cantidad no exceda el stock disponible
    if (newQuantity > maxStock) {
      setSnackbarMessage(`No puedes añadir más unidades. Stock máximo: ${maxStock}`);
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
  };
  
  const clearCart = () => {
    setCart([]);
    setSnackbarMessage('Carrito vaciado');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      getProductQuantityInCart,
      getAvailableStock,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      snackbarOpen,
      snackbarMessage,
      snackbarSeverity,
      handleCloseSnackbar
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;