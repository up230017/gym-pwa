import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box, Divider, Card, CardContent, CardMedia, Alert } from "@mui/material";
import { useRouter } from "next/router";
import JsBarcode from "jsbarcode";
import Cookies from "js-cookie";
import { useCart } from "../context/CartContext"; // Importar el contexto del carrito

const TicketesPage = () => {
  const [purchaseSummary, setPurchaseSummary] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null); // Estado para el método de pago
  const router = useRouter();
  const barcodeValue = Math.random().toString(36).substr(2, 12); // Genera un código aleatorio
  const { clearCart } = useCart(); // Obtener la función para limpiar el carrito

  useEffect(() => {
    // Leer el resumen de compra desde las cookies
    const summaryData = Cookies.get("purchaseSummary");
    if (summaryData) {
      setPurchaseSummary(JSON.parse(summaryData));
    }

    // Obtener el método de pago desde las cookies o la base de datos
    const paymentMethodData = Cookies.get("paymentMethod");
    if (paymentMethodData) {
      setPaymentMethod(JSON.parse(paymentMethodData));
    } else {
      // Si no está en cookies, intentar obtenerlo desde la base de datos
      const fetchPaymentMethod = async () => {
        try {
          const token = Cookies.get("token");
          const userId = Cookies.get("userId");
          if (!token || !userId) return;

          const response = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/method_payment/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) throw new Error("No se encontró un método de pago.");

          const data = await response.json();
          setPaymentMethod(data);
        } catch (error) {
          console.error("Error al obtener el método de pago:", error.message);
          setPaymentMethod(null);
        }
      };

      fetchPaymentMethod();
    }
  }, []);

  const handlePrintTicket = () => {
    const printButton = document.getElementById("print-button");
    const payButton = document.getElementById("pay-button");
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    printButton.style.display = "none";
    payButton.style.display = "none";

    window.print();

    if (header) header.style.display = "block";
    printButton.style.display = "block";
    payButton.style.display = "block";
  };

  const handlePayAndSave = async () => {
    try {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");
      if (!token) throw new Error("No se encontró un token de autenticación.");
      if (!purchaseSummary || !purchaseSummary.products) {
        throw new Error("No hay productos en el resumen de compra.");
      }
  
      const { products, total } = purchaseSummary;
  
      // Restar la cantidad comprada del inventario para cada producto
      await Promise.all(
        products.map(async (product) => {
          const productId = product.id || product._id;
  
          // Obtener información actualizada del producto desde el backend
          const productResponse = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/products/${productId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!productResponse.ok) {
            throw new Error(`Error al obtener información del producto "${product.name}": ${productResponse.statusText}`);
          }
  
          const updatedProduct = await productResponse.json();
  
          // Validar que la cantidad disponible sea suficiente
          if (updatedProduct.amount < product.quantity) {
            throw new Error(`El producto "${product.name}" no tiene suficiente inventario. Disponible: ${updatedProduct.amount}`);
          }
  
          // Reducir la cantidad en el backend
          const reduceResponse = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/products/${productId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: updatedProduct.name,
              amount: updatedProduct.amount - product.quantity, // Reducir cantidad
              price: updatedProduct.price,
              status: updatedProduct.amount - product.quantity === 0 ? "Inactivo" : "Activo",
              details: updatedProduct.details,
              category: updatedProduct.category,
            }),
          });
  
          if (!reduceResponse.ok) {
            const errorData = await reduceResponse.json();
            throw new Error(`Error al actualizar el producto "${product.name}": ${errorData.message || reduceResponse.statusText}`);
          }
        })
      );
  
      // Generar un ID único para la compra
      const orderId = `${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`;
  
      // Crear los detalles del ticket
      const detalles = products
        .map(
          (product) =>
            `Producto: ${product.name}, Cantidad: ${product.quantity}, Precio: $${product.price.toFixed(2)}`
        )
        .join("\n");
      const ticketDetails = `${detalles}\nCódigo de barras: ${barcodeValue}`;
  
      // Guardar el ticket en la base de datos
      const ticketResponse = await fetch("https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/ticket", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idCompra: orderId,
          idUsuario: userId,
          montoDeDinero: total,
          fechaDeEmision: new Date().toISOString(),
          detalles: ticketDetails,
        }),
      });
  
      if (!ticketResponse.ok) {
        const errorData = await ticketResponse.json();
        throw new Error(`Error al guardar el ticket: ${errorData.message || ticketResponse.statusText}`);
      }
  
      const ticketData = await ticketResponse.json();
      console.log("Ticket guardado exitosamente:", ticketData);
  
      // Limpiar el carrito después de procesar el pago
      clearCart();
  
      alert("Pago realizado exitosamente y el ticket ha sido guardado.");
      router.push("/miscompras"); // Redirigir al usuario a "Mis Compras"
    } catch (error) {
      console.error("Error al procesar el pago:", error.message);
      alert(`Hubo un error al procesar el pago: ${error.message}`);
    }
  };
  
  useEffect(() => {
    const barcodeElement = document.getElementById("barcode");
    if (barcodeElement) {
      JsBarcode(barcodeElement, barcodeValue);
    }
  }, [barcodeValue]);

  if (!purchaseSummary) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6">No se encontró información de la compra.</Typography>
      </Container>
    );
  }

  const { products, subtotal, shippingCost, ivaAmount, total } = purchaseSummary;

  return (
    <Container maxWidth="sm" sx={{ padding: 4, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
      <Typography variant="h4" align="center" fontWeight="bold">
        GLADIATOR GYM
      </Typography>
      <Typography align="center">COMPRA Y PAGA</Typography>
      <Typography align="center">AVDA. DEL CONSUMIDOR</Typography>
      <Divider sx={{ marginY: 2, backgroundColor: "#000" }} />

      <Box>
        {products.map((product, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CardMedia
                component="img"
                sx={{ width: 80, height: 80, objectFit: "cover" }}
                image={product.image || "https://via.placeholder.com/80"}
                alt={product.name || "Producto"}
              />
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography variant="body1" fontWeight="bold">
                  {product.name || "Producto sin nombre"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cantidad: {product.quantity || 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio unitario: ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Subtotal: ${(product.price * product.quantity).toFixed(2)}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Box>

      <Divider sx={{ marginY: 2, backgroundColor: "#000" }} />

      <Typography variant="h6">Subtotal: ${subtotal.toFixed(2)}</Typography>
      <Typography>Envío: {shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}</Typography>
      <Typography>IVA (16%): ${ivaAmount.toFixed(2)}</Typography>
      <Typography variant="h5" fontWeight="bold">TOTAL: ${total.toFixed(2)}</Typography>

      {paymentMethod ? (
        <Box sx={{ padding: 2, backgroundColor: "#f1f1f1", borderRadius: 2, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Método de Pago</Typography>
          <Typography>Número de Tarjeta: **** **** **** {paymentMethod.number_account.slice(-4)}</Typography>
          <Typography>Tipo de Pago: {paymentMethod.type_payment}</Typography>
          <Typography>Proveedor: {paymentMethod.supplier}</Typography>
          <Typography>Fecha de Expiración: {paymentMethod.expiration_date}</Typography>
        </Box>
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se encontró un método de pago. Por favor, agrega uno para continuar.
        </Alert>
      )}

      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <svg id="barcode"></svg>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 3 }}>
        <Button id="print-button" variant="contained" color="primary" fullWidth onClick={handlePrintTicket}>
          Imprimir Ticket
        </Button>
        <Button
          id="pay-button"
          variant="contained"
          sx={{ backgroundColor: "#f57c00", color: "#fff", "&:hover": { backgroundColor: "#ef6c00" } }}
          fullWidth
          onClick={handlePayAndSave}
          disabled={!paymentMethod} // Deshabilitar si no hay método de pago
        >
          Pagar
        </Button>
      </Box>
    </Container>
  );
};

export default TicketesPage;