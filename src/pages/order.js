"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useCart } from "../context/CartContext" // Importamos el contexto del carrito

const OrderPage = () => {
  const [user, setUser] = useState({})
  const [products, setProducts] = useState([]) // Productos del carrito desde API
  const [orderProduct, setOrderProduct] = useState(null) // Producto comprado directamente
  const [total, setTotal] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [supplier, setSupplier] = useState(""); // Estado para el proveedor del método de pago
  const [shippingCost, setShippingCost] = useState(0)
  const [ivaAmount, setIvaAmount] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState("")
  const [cvv, setCvv] = useState("")
  const [loading, setLoading] = useState(true)
  const [productId, setProductId] = useState(null) // Para guardar el ID del producto
  const router = useRouter()
  const { cart } = useCart() // Obtenemos el carrito del contexto

  // Nuevos estados para la dirección
  const [country, setCountry] = useState("")
  const [fullName, setFullName] = useState("")
  const [streetNumber, setStreetNumber] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")

  // Nuevos estados para el método de pago
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiration, setCardExpiration] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verificar que cart existe antes de usarlo
        const safeCart = cart || []
        console.log("Carrito desde el contexto:", safeCart) // Depuración

        // Intentar obtener el producto de la cookie primero
        const productData = Cookies.get("orderProduct")
        console.log("Cookie orderProduct:", productData) // Depuración

        if (productData) {
          try {
            const parsedProduct = JSON.parse(productData)
            console.log("Producto parseado de cookie:", parsedProduct) // Depuración
            setOrderProduct(parsedProduct)

            // Guardar el ID del producto para poder volver a él
            if (parsedProduct.id) {
              setProductId(parsedProduct.id)
            }
          } catch (error) {
            console.error("Error al parsear el producto de las cookies:", error)
          }
        }

        // Si no hay producto en la cookie, no hay problema, continuamos con los productos del carrito
        if (!productData) {
          console.log("No hay producto directo, continuando con productos del carrito")
        }

        const token = Cookies.get("token")
        if (!token) {
          console.log("No se encontró token, usando datos del contexto")

          // Si no hay token, usamos los productos del contexto del carrito
          setProducts(safeCart)

          // Calcular subtotal, IVA, envío y total
          calculateTotals(safeCart, orderProduct)

          setLoading(false)
          return
        }

        const userId = Cookies.get("userId")
        if (!userId) {
          console.log("No se encontró userId, usando datos del contexto")

          // Si no hay userId, usamos los productos del contexto del carrito
          setProducts(safeCart)

          // Calcular subtotal, IVA, envío y total
          calculateTotals(safeCart, orderProduct)

          setLoading(false)
          return
        }

        // Obtener datos del usuario
        const userResponse = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!userResponse.ok) {
          console.log("Error al obtener datos del usuario, usando datos del contexto")
          setProducts(safeCart)
          calculateTotals(safeCart, orderProduct)
          setLoading(false)
          return
        }

        const userData = await userResponse.json()
        setUser(userData)
        setFullName(userData.name || "")

        // Obtener productos del carrito desde la API
        try {
          const productsResponse = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/cart/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (!productsResponse.ok) {
            console.log("Error al obtener productos del carrito desde API, usando datos del contexto")
            setProducts(safeCart)
          } else {
            const productsData = await productsResponse.json()
            console.log("Productos del carrito desde API:", productsData) // Depuración

            // Si no hay productos en la API pero sí en el contexto, usamos los del contexto
            if (!productsData || productsData.length === 0) {
              console.log("No hay productos en la API, usando datos del contexto")
              setProducts(safeCart)
            } else {
              setProducts(productsData)
            }
          }
        } catch (error) {
          console.error("Error al obtener productos del carrito:", error)
          setProducts(safeCart) // Usar productos del contexto en caso de error
        }

        // Calcular subtotal, IVA, envío y total
        calculateTotals(safeCart, orderProduct)
      } catch (error) {
        console.error("Error en fetchUserData:", error.message)

        // En caso de error, intentamos usar los datos del contexto
        const safeCart = cart || []
        setProducts(safeCart)
        calculateTotals(safeCart, orderProduct)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [cart])

  // Función para calcular subtotal, IVA, envío y total
  const calculateTotals = (cartProducts, directProduct) => {
    // Calcular subtotal de los productos del carrito
    let calculatedSubtotal = cartProducts.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)

    // Añadir el subtotal del producto directo si existe
    if (directProduct) {
      calculatedSubtotal += directProduct.price * (directProduct.quantity || 1)
    }

    setSubtotal(calculatedSubtotal)

    // Calcular IVA
    const iva = calculatedSubtotal * 0.16
    setIvaAmount(iva)

    // Calcular envío
    const shipping = calculatedSubtotal > 300 ? 0 : 59
    setShippingCost(shipping)

    // Calcular total
    setTotal(calculatedSubtotal + iva + shipping)
  }

  const handleConfirmPurchase = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No se encontró un token de autenticación.");

      // Combinar productos del carrito y producto directo (si existe)
      const allProducts = [...products];
      if (orderProduct) allProducts.push(orderProduct);

      // Actualizar la cantidad de productos en el inventario
      await Promise.all(
        allProducts.map(async (product) => {
          await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/products/${product.id || product._id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: product.amount - product.quantity }),
          });
        })
      );

      // Calcular el subtotal, IVA, envío y total
      const calculatedSubtotal = allProducts.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
      const iva = calculatedSubtotal * 0.16;
      const shipping = calculatedSubtotal > 300 ? 0 : 59;
      const total = calculatedSubtotal + iva + shipping;

      // Guardar el resumen de compra en cookies
      const purchaseSummary = {
        products: allProducts,
        subtotal: calculatedSubtotal,
        shippingCost: shipping,
        ivaAmount: iva,
        total,
      };
      Cookies.set("purchaseSummary", JSON.stringify(purchaseSummary), { expires: 1, path: "/" });

      // Limpiar la cookie del producto comprado directamente
      Cookies.remove("orderProduct", { path: "/" });

      // Redirigir a la página de ticketes
      router.push("/ticketes");
    } catch (error) {
      console.error("Error al finalizar la compra:", error.message);
    }
  };

  const handleUpdateAddress = async () => {
    try {
      const token = Cookies.get("token")
      const userId = Cookies.get("userId")
      if (!token || !userId) throw new Error("No se encontró autenticación o ID del usuario.")

      const newDirection = `${country} ${streetNumber} ${postalCode}`

      const response = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/user/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: fullName, direction: newDirection }),
      })

      if (!response.ok) throw new Error("Error al actualizar la dirección y el nombre.")
      alert("Nombre y dirección actualizados correctamente.")
    } catch (error) {
      console.error("Error al actualizar la dirección y el nombre:", error.message)
      alert(error.message)
    }
  }

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
      const response = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/method_payment/${userId}`, {
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
  // Verificar si hay productos para mostrar
  const hasProducts = (products && products.length > 0) || orderProduct

  return (
    <Container maxWidth="lg" sx={{ display: "flex", gap: 3, py: 4 }}>
      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Sección de Datos Personales del archivo .txt */}
        <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Datos Personales
          </Typography>
          <Typography>Nombre: {user.name}</Typography>
          <Typography>Correo: {user.email}</Typography>
          <Typography>Dirección: {user.direction}</Typography>
        </Box>

        {/* Sección de Dirección de Envío - Manteniendo el código del .tsx */}
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

        {/* Sección de Método de Pago - Manteniendo el código del .tsx */}
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
            Agregar Tarjeta
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Resumen de Compra
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress color="error" />
            </Box>
          ) : (
            <>
              {products && products.length > 0 ? (
                <>
                  {products.map((product, index) => (
                    <Card key={product._id || product.id || `product-${index}`} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, objectFit: "cover" }}
                          image={product.image || "https://via.placeholder.com/80"}
                          alt={product.name || "Producto"}
                        />
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography variant="body1" component="div">
                            {product.name || "Producto sin nombre"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.quantity || 1} x ${product.price || 0}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            Subtotal: ${((product.quantity || 1) * product.price).toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  ))}
                </>
              ) : (
                !orderProduct && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No hay productos en el carrito.
                  </Typography>
                )
              )}

              {!hasProducts && (
                <Typography variant="body1" color="error" sx={{ my: 2, textAlign: "center" }}>
                  No hay productos para procesar. Por favor, agrega productos al carrito.
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

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    flex: 2,
                    bgcolor: "#43a047",
                    "&:hover": { bgcolor: "#2e7d32" },
                  }}
                  onClick={handleConfirmPurchase}
                  disabled={!hasProducts}
                >
                  Confirmar Compra
                </Button>
              </Stack>
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
  )
}

export default OrderPage

