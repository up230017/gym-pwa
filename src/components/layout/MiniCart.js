"use client";

import React, { useState, useEffect, useContext } from "react"; // Agregado useContext
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete"; // Importar el ícono de eliminar
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/router";
import { AuthContext } from '../../context/AuthContext';

const MiniCart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart(); // Incluimos `updateQuantity` del contexto
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { isAuthenticated, user } = useContext(AuthContext); // Ahora useContext está definido

  // Estado para manejar los productos del carrito
  const [cartItems, setCartItems] = useState([]); // Agregado este estado

  // Verificar que cart existe antes de usarlo
  const safeCart = cartItems.length > 0 ? cartItems : cart || [];

  // Calcular el número total de productos (cartCount)
  const cartCount = safeCart.reduce((total, item) => total + (item.quantity || 1), 0);

  // Calcular el total del carrito
  const cartTotal = safeCart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewCart = () => {
    handleClose();
    router.push("/cart");
  };

  const handleProceedToCheckout = () => {
    // Verificar si hay productos que exceden el stock
    if (safeCart.some((item) => (item.quantity || 1) > (item.amount || 0))) {
      alert("Algunos productos en tu carrito exceden el stock disponible. Por favor, ajusta las cantidades.");
      return;
    }

    // Redirigir a la página de orden
    handleClose();
    router.push("/order");
  };

  const handleIncreaseQuantity = (item) => {
    const maxStock = item.amount || 0;

    if (item.quantity < maxStock) {
      updateQuantity(item.id || item._id, item.quantity + 1, maxStock);
    } else {
      alert(`Solo hay ${maxStock} unidades disponibles de ${item.name}.`);
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id || item._id, item.quantity - 1, item.amount || 0);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated || !user) {
        setCartItems([]); // Si no está autenticado, no mostrar productos
        return;
      }

      try {
        const token = Cookies.get('token');
        const userId = user.id;

        const response = await fetch(`http://localhost:3005/api/cart/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los productos del carrito.');
        }

        const data = await response.json();
        setCartItems(data.products || []);
      } catch (error) {
        console.error('Error al cargar los productos del carrito:', error.message);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, user]);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? "mini-cart-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {isAuthenticated ? (
          <Badge badgeContent={cartCount} color="warning" showZero>
            <ShoppingCartIcon sx={{ color: "#FFFFFF" }} />
          </Badge>
        ) : (
          <ShoppingCartIcon sx={{ color: "#FFFFFF" }} />
        )}
      </IconButton>

      <Menu
        id="mini-cart-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: {
            width: "300px",
            maxHeight: "400px",
          },
        }}
      >
        <Box sx={{ p: 2, bgcolor: "#DC143CF1", color: "white" }}>
          <Typography variant="h6">Tu Carrito</Typography>
        </Box>

        {!isAuthenticated ? (
          <MenuItem>
            <Typography>Inicia sesión para ver tu carrito.</Typography>
          </MenuItem>
        ) : safeCart.length === 0 ? (
          <MenuItem>
            <Typography>Tu carrito está vacío</Typography>
          </MenuItem>
        ) : (
          <>
            {safeCart.slice(0, 3).map((item) => (
              <MenuItem key={item.id || item._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.quantity || 1} x ${item.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleDecreaseQuantity(item)}
                      sx={{ minWidth: "30px", padding: 0 }}
                    >
                      -
                    </Button>
                    <Typography variant="body2">{item.quantity}</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleIncreaseQuantity(item)}
                      sx={{ minWidth: "30px", padding: 0 }}
                    >
                      +
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id || item._id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </MenuItem>
            ))}

            {safeCart.length > 3 && (
              <MenuItem>
                <Typography variant="body2" color="text.secondary" sx={{ width: "100%", textAlign: "center" }}>
                  Y {safeCart.length - 3} producto(s) más...
                </Typography>
              </MenuItem>
            )}

            <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                Total: ${cartTotal.toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={handleViewCart}
                sx={{
                  mb: 1,
                  bgcolor: "#DC143CF1",
                  "&:hover": { bgcolor: "#b01030" },
                }}
              >
                Ver carrito completo
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleProceedToCheckout}
                sx={{
                  color: "#DC143CF1",
                  borderColor: "#DC143CF1",
                  "&:hover": {
                    borderColor: "#b01030",
                    bgcolor: "rgba(220, 20, 60, 0.04)",
                  },
                }}
              >
                Proceder al pago
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default MiniCart;