"use client";
import { useCart } from "../context/CartContext";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Divider,
  TextField,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
import { useState } from "react";

// Definición de colores para fácil modificación
const colors = {
  primary: "#DC143CF1", // Rojo carmesí
  primaryHover: "#B22222", // Rojo más oscuro para hover
  secondary: "#333333", // Gris oscuro para textos
  background: "#FFFFFF", // Fondo blanco
  cardBackground: "#F8F8F8", // Gris muy claro para tarjetas
  textPrimary: "#333333", // Texto principal
  textSecondary: "#666666", // Texto secundario
  border: "#E0E0E0", // Color de bordes
  success: "#4CAF50", // Verde para botones de acción positiva
};

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleCloseSnackbar,
  } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Verificar que cart existe antes de usarlo
  const safeCart = cart || [];

  // Calcular el total del carrito
  const cartTotal = safeCart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  // Calcular el número total de productos
  const totalItems = safeCart.reduce((total, item) => total + (item.quantity || 1), 0);

  // Manejar el proceso de pago
  const handleCheckout = () => {
    // Verificar si hay productos que exceden el stock
    if (safeCart.some((item) => (item.quantity || 1) > (item.amount || 0))) {
      return; // No permitir el checkout si hay productos que exceden el stock
    }

    console.log("Redirigiendo a la página de orden...");

    // Redirigir a la página de orden usando push
    try {
      router.push("/order");
    } catch (error) {
      console.error("Error al redirigir:", error);

      // Alternativa: usar window.location
      window.location.href = "/order";
    }
  };

  // Si el carrito está vacío
  if (!safeCart.length) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          mb: 4,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Typography variant="body1" gutterBottom>
          Parece que aún no has añadido productos a tu carrito.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/")}
          sx={{
            mt: 2,
            backgroundColor: colors.primary,
            "&:hover": { backgroundColor: colors.primaryHover },
          }}
        >
          Continuar comprando
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: colors.secondary, fontWeight: "bold", mb: 4 }}>
        Tu Carrito de Compras
      </Typography>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} message={snackbarMessage} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            {safeCart.map((item) => {
              const productId = item.id || item._id;
              const maxStock = item.amount || 0;
              const isOverStock = (item.quantity || 1) > maxStock;

              return (
                <Box key={productId} sx={{ mb: 2, pb: 2, borderBottom: `1px solid ${colors.border}` }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={2}>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        style={{ width: "100%", maxHeight: "80px", objectFit: "contain" }}
                      />
                    </Grid>
                    <Grid item xs={9} sm={4}>
                      <Typography variant="h6" component="h3">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.description && item.description.substring(0, 60)}
                        {item.description && item.description.length > 60 ? "..." : ""}
                      </Typography>

                      {/* Mostrar advertencia si la cantidad excede el stock */}
                      {isOverStock && (
                        <Typography variant="body2" sx={{ color: "error.main", fontWeight: "bold", mt: 1 }}>
                          ¡Solo hay {maxStock} unidades disponibles!
                        </Typography>
                      )}

                      {/* Mostrar stock disponible */}
                      {!isOverStock && maxStock > 0 && (
                        <Typography variant="body2" sx={{ color: "green", mt: 1 }}>
                          {maxStock} disponibles
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (item.quantity > maxStock) {
                              // Ajustar automáticamente al máximo permitido si excede el stock
                              updateQuantity(productId, maxStock, maxStock);
                              alert(`La cantidad de ${item.name} se ajustó automáticamente a ${maxStock}.`);
                            } else if (item.quantity > 1) {
                              // Reducir la cantidad normalmente
                              updateQuantity(productId, item.quantity - 1, maxStock);
                            }
                          }}
                          sx={{ color: colors.primary }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity || 1}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              updateQuantity(productId, value, maxStock);
                            }
                          }}
                          inputProps={{
                            min: 1,
                            max: maxStock,
                            style: { textAlign: "center", width: "40px" },
                          }}
                          variant="outlined"
                          sx={{ mx: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(productId, (item.quantity || 1) + 1, maxStock)}
                          sx={{ color: colors.primary }}
                          disabled={(item.quantity || 1) >= maxStock}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={4} sm={2} sx={{ textAlign: "right" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.primary }}>
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price.toFixed(2)} c/u
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={1} sx={{ textAlign: "right" }}>
                      <IconButton color="error" onClick={() => removeFromCart(productId)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Paper>

          {/* Mostrar advertencia si hay productos que exceden el stock */}
          {safeCart.some((item) => (item.quantity || 1) > (item.amount || 0)) && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Algunos productos en tu carrito exceden el stock disponible. Por favor, ajusta las cantidades.
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/")}
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                "&:hover": {
                  borderColor: colors.primaryHover,
                  backgroundColor: "rgba(220, 20, 60, 0.04)",
                },
              }}
            >
              Continuar comprando
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
              sx={{
                borderColor: "error.main",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              Vaciar carrito
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Resumen del Pedido
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body1">
                Subtotal ({totalItems} {totalItems === 1 ? "producto" : "productos"}):
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                ${cartTotal.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body1">Envío:</Typography>
              <Typography variant="body1" sx={{ color: "green" }}>
                Gratis
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.primary }}>
                ${cartTotal.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              disabled={safeCart.some((item) => (item.quantity || 1) > (item.amount || 0))}
              sx={{
                backgroundColor: colors.success,
                color: "white",
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#3d8b40",
                },
                mb: 2,
                "&.Mui-disabled": {
                  backgroundColor: "#cccccc",
                },
              }}
            >
              PROCEDER AL PAGO
            </Button>

            {/* Mostrar mensaje si hay productos que exceden el stock */}
            {safeCart.some((item) => (item.quantity || 1) > (item.amount || 0)) && (
              <Typography variant="body2" sx={{ color: "error.main", textAlign: "center", mb: 2 }}>
                Ajusta las cantidades para continuar
              </Typography>
            )}

            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push("/")}
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                "&:hover": {
                  borderColor: colors.primaryHover,
                  backgroundColor: "rgba(220, 20, 60, 0.04)",
                },
              }}
            >
              CONTINUAR COMPRANDO
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;