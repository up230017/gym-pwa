"use client";

import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    Divider,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Stack,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const ProductSell = () => {
    const [user, setUser] = useState({});
    const [orderProduct, setOrderProduct] = useState(null); // Producto comprado directamente
    const [total, setTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [ivaAmount, setIvaAmount] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [cvv, setCvv] = useState("");
    const [products, setProducts] = useState([]); // Estado para manejar productos del carrito
    const [loading, setLoading] = useState(true);
    const [supplier, setSupplier] = useState(""); // Estado para el proveedor del método de pago
    const router = useRouter();

    // Nuevos estados para la dirección
    const [country, setCountry] = useState("");
    const [fullName, setFullName] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [deliveryInstructions, setDeliveryInstructions] = useState("");

    // Nuevos estados para el método de pago
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiration, setCardExpiration] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Intentar obtener el producto de la cookie
                const productData = Cookies.get("orderProduct");

                if (productData) {
                    const parsedProduct = JSON.parse(productData);
                    setOrderProduct(parsedProduct);

                    // Calcular subtotal inicial basado en el producto de la cookie
                    const initialSubtotal = parsedProduct.price * parsedProduct.quantity;
                    setSubtotal(initialSubtotal);

                    // Calcular IVA y envío
                    const iva = initialSubtotal * 0.16;
                    setIvaAmount(iva);

                    const shipping = initialSubtotal > 300 ? 0 : 59;
                    setShippingCost(shipping);

                    // Calcular total
                    setTotal(initialSubtotal + iva + shipping);
                }

                const token = Cookies.get("token");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const userId = Cookies.get("userId");
                if (!userId) {
                    setLoading(false);
                    return;
                }

                // Obtener datos del usuario
                const userResponse = await fetch(`http://localhost:3005/api/user/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!userResponse.ok) throw new Error("Error al obtener los datos del usuario.");
                const userData = await userResponse.json();
                setUser(userData);
                setFullName(userData.name || "");
            } catch (error) {
                console.error("Error en fetchUserData:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);
    const handleUpdateCard = async () => {
        try {
            const token = Cookies.get("token");
            const userId = Cookies.get("userId");
            if (!token || !userId) throw new Error("No se encontró autenticación o ID del usuario.");

            // Validar los campos requeridos
            if (!selectedMethod || !cardNumber || !cardExpiration || !cvv || !supplier) {
                alert("Por favor, completa todos los campos del método de pago.");
                return;
            }

            // Crear el objeto de método de pago
            const paymentMethodData = {
                userId,
                number_account: cardNumber,
                type_payment: selectedMethod,
                supplier, // Guardar el proveedor ingresado
                expiration_date: cardExpiration,
            };

            // Guardar en la base de datos
            const response = await fetch(`http://localhost:3005/api/method_payment/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentMethodData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar el método de pago.");
            }

            // Guardar en cookies para usar en ticket.js y ticketes.js
            Cookies.set("paymentMethod", JSON.stringify(paymentMethodData), { expires: 1, path: "/" });

            alert("Método de pago guardado correctamente.");
        } catch (error) {
            console.error("Error al guardar el método de pago:", error.message);
            alert(error.message);
        }
    };
    const handleConfirmPurchase = async () => {
        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("No se encontró un token de autenticación.");

            // Actualizar la cantidad de productos en el inventario
            if (orderProduct) {
                await fetch(`http://localhost:3005/api/products/${orderProduct.id || orderProduct._id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ amount: orderProduct.amount - orderProduct.quantity }),
                });
            }

            // Guardar el resumen de compra en cookies
            const purchaseSummary = {
                products: [orderProduct],
                subtotal,
                shippingCost,
                ivaAmount,
                total,
            };
            Cookies.set("purchaseSummary", JSON.stringify(purchaseSummary), { expires: 1, path: "/" });

            // Limpiar la cookie del producto comprado directamente
            Cookies.remove("orderProduct", { path: "/" });

            // Redirigir a la página de ticket
            router.push("/ticket");
        } catch (error) {
            console.error("Error al finalizar la compra:", error.message);
        }
    };

    const handleUpdateAddress = async () => {
        try {
            const token = Cookies.get("token");
            const userId = Cookies.get("userId");
            if (!token || !userId) throw new Error("No se encontró autenticación o ID del usuario.");

            const newDirection = `${country} ${streetNumber} ${postalCode}`;

            const response = await fetch(`http://localhost:3005/api/user/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: fullName, direction: newDirection }),
            });

            if (!response.ok) throw new Error("Error al actualizar la dirección y el nombre.");
            alert("Nombre y dirección actualizados correctamente.");
        } catch (error) {
            console.error("Error al actualizar la dirección y el nombre:", error.message);
            alert(error.message);
        }
    };
    const hasProducts = (products && products.length > 0) || orderProduct;
    return (
        <Container maxWidth="lg" sx={{ display: "flex", gap: 3, py: 4 }}>
            <Box sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Datos Personales */}
                <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Datos Personales
                    </Typography>
                    <Typography>Nombre: {user.name}</Typography>
                    <Typography>Correo: {user.email}</Typography>
                    <Typography>Dirección: {user.direction}</Typography>
                </Box>

                {/* Dirección de Envío */}
                <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Dirección de Envío
                    </Typography>
                    <TextField label="País" fullWidth required value={country} onChange={(e) => setCountry(e.target.value)} />
                    <TextField
                        label="Nombre Completo"
                        fullWidth
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextField
                        label="Calle y Número"
                        fullWidth
                        required
                        value={streetNumber}
                        onChange={(e) => setStreetNumber(e.target.value)}
                    />
                    <TextField
                        label="Código Postal"
                        fullWidth
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                    <TextField
                        label="Instrucciones de Entrega"
                        fullWidth
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleUpdateAddress}>
                        Listo
                    </Button>
                </Box>

                {/* Método de Pago */}
                {/* Método de Pago */}
                <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Método de Pago
                    </Typography>
                    <Select
                        fullWidth
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        displayEmpty
                        margin="dense"
                        sx={{ my: 2 }}
                    >
                        <MenuItem value="" disabled>
                            Seleccione un método de pago
                        </MenuItem>
                        <MenuItem value="tarjeta">Tarjeta de Crédito</MenuItem>
                        <MenuItem value="transferencia">Transferencia Bancaria</MenuItem>
                        <MenuItem value="pago-electronico">Pago Electrónico</MenuItem>
                    </Select>
                    <TextField
                        label="Número de Tarjeta"
                        fullWidth
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Fecha de Expiración"
                        type="month"
                        fullWidth
                        required
                        value={cardExpiration}
                        onChange={(e) => setCardExpiration(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="CVV"
                        fullWidth
                        required
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Proveedor (Banco/Entidad)"
                        fullWidth
                        required
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)} // Nuevo campo para el proveedor
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleUpdateCard}>
                        Confirmar
                    </Button>
                </Box>
            </Box>

            <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Resumen de Compra
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                            <CircularProgress color="error" />
                        </Box>
                    ) : (
                        <>
                            {orderProduct ? (
                                <Card sx={{ mb: 3, border: "1px solid #DC143CF1" }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 100, height: 100, objectFit: "cover" }}
                                            image={orderProduct.image || "https://via.placeholder.com/100"}
                                            alt={orderProduct.name || "Producto"}
                                        />
                                        <CardContent sx={{ flex: "1 0 auto" }}>
                                            <Typography variant="h6" component="div">
                                                {orderProduct.name || "Producto sin nombre"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Cantidad: {orderProduct.quantity || 1}
                                            </Typography>
                                            <Typography variant="body1">Precio unitario: ${orderProduct.price || 0}</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                Subtotal: ${orderProduct.price * orderProduct.quantity || 0}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Card>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    No hay producto seleccionado directamente.
                                </Typography>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography>Subtotal:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">${subtotal ? subtotal.toFixed(2) : "0.00"}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography>Envío:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">{shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography>IVA (16%):</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">${ivaAmount.toFixed(2)}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Total:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" fontWeight="bold" align="right" sx={{ color: "#DC143CF1" }}>
                                        ${total.toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* Botón Confirmar Compra */}
                            <Button
                                variant="contained"
                                sx={{
                                    flex: 2,
                                    bgcolor: "#43a047",
                                    "&:hover": { bgcolor: "#2e7d32" },
                                }}
                                onClick={handleConfirmPurchase}
                                disabled={!hasProducts} // Deshabilitar si no hay productos
                            >
                                Confirmar Compra
                            </Button>
                        </>
                    )}
                </Box>

                <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                    <Typography variant="body2">
                        ¿Necesitas ayuda? Explora nuestras Páginas de ayuda o contáctanos. <br />
                        En un plazo de 30 días desde la entrega, puedes devolver el artículo en su estado original. Se aplican
                        restricciones. <br />
                        Consulta nuestra Política de devoluciones.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default ProductSell;