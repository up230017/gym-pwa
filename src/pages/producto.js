"use client"

import { useState, useEffect } from "react"
import { Typography, CardMedia, Divider, Button, TextField, IconButton, Snackbar, Alert, Container, Grid } from "@mui/material"
import { Add, Remove } from "@mui/icons-material"
import { useRouter } from "next/router"
import Cookies from "js-cookie"
import { useCart } from "../context/CartContext" // Importamos el contexto del carrito
import "../styles/wavesMin.css" // Asegúrate de que la ruta sea correcta
import { Delete } from "@mui/icons-material";

const ProductoDetalle = () => {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [redirecting, setRedirecting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  // Obtenemos todas las funciones necesarias del contexto
  const { addToCart, cart } = useCart() // Obtenemos también el carrito para verificar

  const incrementQuantity = () => {
    if (quantity < product.amount) {
      setQuantity((prev) => prev + 1);
    } else {
      showSnackbar(`Solo hay ${product.amount} unidades disponibles de este producto.`);
      setQuantity(product.amount); // Ajustar automáticamente al máximo disponible
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("No se encontró un token de autenticación.");
  
        // Obtener información del producto junto con sus comentarios asociados
        const productResponse = await fetch(`http://localhost:3005/api/products/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!productResponse.ok) throw new Error(`Error al cargar el producto: ${productResponse.statusText}`);
  
        const productData = await productResponse.json();
        setProduct(productData);
  
        // Obtener los comentarios del producto desde el modelo de comentarios en la API
        const commentsResponse = await fetch(`http://localhost:3005/api/comments?product_id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!commentsResponse.ok) throw new Error(`Error al cargar los comentarios: ${commentsResponse.statusText}`);
  
        const commentsData = await commentsResponse.json();
  
        // Filtrar solo los comentarios que pertenecen al producto actual
        const filteredComments = commentsData.filter(comment => comment.product_id === id);
        setComments(filteredComments); // Asegurar que los comentarios sean del producto correcto
  
        // Obtener las categorías
        const categoryResponse = await fetch("http://localhost:3005/api/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!categoryResponse.ok) throw new Error(`Error al cargar las categorías: ${categoryResponse.statusText}`);
  
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchProductAndCategories();
    }
  }, [id]);

  // Efecto para redirigir después de agregar al carrito
  useEffect(() => {
    if (redirecting && !loading) {
      const timer = setTimeout(() => {
        router.push("/order")
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [redirecting, loading, router])

  // Obtener el nombre de la categoría
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId)
    return category ? category.name : "Sin categoría"
  }

  // Función para mostrar snackbar
  const showSnackbar = (message) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  // Modificar la función handleAddToCart para verificar el stock disponible
  const handleAddToCart = () => {
    if (!product) return;

    // Verificar que no se exceda el stock disponible
    if (quantity > product.amount) {
      showSnackbar(`Solo hay ${product.amount} unidades disponibles de este producto.`);
      return;
    }

    // Crear el objeto del producto para agregar al carrito
    const productToAdd = {
      id: product._id,
      _id: product._id, // Incluimos ambos para compatibilidad
      name: product.name,
      price: product.price,
      quantity: quantity, // Usar la cantidad seleccionada por el usuario
      image: product.image,
      amount: product.amount, // Incluimos el stock disponible
      description: product.details || "Sin descripción",
    };

    // Agregar al carrito usando la función del contexto
    addToCart(productToAdd);
    showSnackbar("Producto agregado al carrito");
  };
  const handleAddComment = async () => {
    try {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");
  
      if (!token || !userId) throw new Error("No se encontró autenticación o ID del usuario.");
      if (!newComment.trim()) {
        alert("El comentario no puede estar vacío.");
        return;
      }
  
      const commentData = {
        product_id: product._id,
        user_id: userId,
        content: newComment
      };
  
      const response = await fetch("http://localhost:3005/api/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(commentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar el comentario.");
      }
  
      // Recargar el producto para obtener los comentarios actualizados
      const updatedProductResponse = await fetch(`http://localhost:3005/api/products/${product._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!updatedProductResponse.ok) throw new Error("Error al cargar comentarios actualizados.");
  
      const updatedProduct = await updatedProductResponse.json();
      setComments(updatedProduct.comments || []); // Actualizar con comentarios desde la base de datos
  
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar el comentario:", error.message);
      alert(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No se encontró autenticación.");

      const response = await fetch(`http://localhost:3005/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el comentario.");
      }

      setComments(comments.filter(comment => comment._id !== commentId));
      alert("Comentario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el comentario:", error.message);
      alert(error.message);
    }
  };


  // Modificar la función handleBuyNow para verificar el stock disponible y asegurar que se agregue al carrito
  const handleBuyNow = () => {
    if (!product) return;

    // Crear el objeto del producto para guardar en la cookie
    const productToAdd = {
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      amount: product.amount,
      description: product.details || "Sin descripción",
    };

    // Guardar el producto en una cookie
    Cookies.set("orderProduct", JSON.stringify(productToAdd), { expires: 1, path: "/" });

    // Redirigir a la página de productsell
    router.push("/productsell");
  };

  return (
    <div
      style={{

        display: "flex",
        flexDirection: "row",
        backgroundColor: "transparent",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {loading ? (
        <Typography variant="h5" align="center" style={{ color: "#000", marginTop: "20px" }}>
          Cargando producto...
        </Typography>
      ) : error ? (
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      ) : product ? (
        <>
          {/* Primera Parte: Imagen */}
          <div style={{ flex: 1, padding: "20px" }}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              style={{
                width: "400px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "8px",
                border: `3px solid #DC143CF1`,
              }}
            />
          </div>

          {/* Segunda Parte: Información Principal */}
          <Container maxWidth="md" sx={{ mt: 4, pb: 5 }}>

            <Typography variant="h3" style={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>
            <Typography variant="h5" style={{ margin: "10px 0" }}>
              💲 Precio: ${product.price}
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              Devolución garantizada y pago con transferencia disponibles.
            </Typography>
            <Divider style={{ backgroundColor: "#DC143CF1", height: "3px", margin: "20px 0" }} />
            <Typography>
              <strong>Marca:</strong> {product.brand || "Genérica"}
            </Typography>
            <Typography>
              <strong>Forma:</strong> {product.shape || "N/A"}
            </Typography>
            <Typography>
              <strong>Fabricante:</strong> {product.manufacture || "Anónimo"}
            </Typography>
            <Typography>
              <strong>Cantidad Disponible:</strong> {product.amount}
            </Typography>
            <Typography>
              <strong>Categoría:</strong> {getCategoryName(product.category)}
            </Typography>
            <Divider style={{ backgroundColor: "#DC143CF1", height: "3px", margin: "20px 0" }} />
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              <strong>Acerca de este artículo:</strong> {product.details || "Información no disponible"}
            </Typography>


            <Container maxWidth="md" sx={{ mt: 4, pb: 5 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#DC143CF1",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  mt: 2,  // Margen superior aumentado
                  mb: 2,  // Margen inferior aumentado
                  p: 2    // Padding adicional para mejor espacio interno
                }}
              >
                Comentarios de Guerreros
              </Typography>

              <Grid container spacing={2} justifyContent="center">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <div style={{
                        backgroundColor: "#FFF",
                        padding: "8px",
                        borderRadius: "6px",
                        boxShadow: "1px 1px 6px rgba(0, 0, 0, 0.1)",
                        borderLeft: "3px solid #DC143CF1",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#000", fontSize: "0.9rem", mb: 1 }}>
                          {comment.user?.name}
                        </Typography>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" sx={{ color: "#333", fontSize: "0.85rem" }}>
                            {comment.content}
                          </Typography>
                          <IconButton onClick={() => handleDeleteComment(comment._id)} sx={{ color: "#B22222" }}>
                            <Delete />
                          </IconButton>
                        </div>
                      </div>
                    </Grid>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#888",
                      fontStyle: "italic",
                      textAlign: "left"  // Alineación a la izquierda
                    }}
                  >
                    Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!
                  </Typography>
                )}
              </Grid>

              <TextField
                label="Escribe tu comentario"
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  width: "90%",
                  mt: 2,
                  bgcolor: "#FFF",
                  borderRadius: "8px",
                  boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)"
                }}
              />

              <Button
                onClick={handleAddComment}
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#DC143CF1",
                  color: "#FFF",
                  textTransform: "uppercase",
                  boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#B22222" }
                }}>
                Agregar Comentario
              </Button>
            </Container>
          </Container>


          {/* Tercera Parte: Interacción */}
          <div className="wave-container-min">
            <div className="waven"></div>
            <div className="waven"></div>
            <div className="waven"></div>
            <div className="waven"></div>
          </div>

          <div
            style={{
              width: "250px",
              height: "350px",
              backgroundColor: "#DC143CF1",
              borderRadius: "8px",
              padding: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "30px",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h5"
              style={{
                color: "#FFD700",
                fontWeight: "bold",
                fontSize: "2rem",
                marginBottom: "10px",
                textTransform: 'uppercase',
                textAlign: 'center'
              }}
            >
              Cantidad a comprar:
            </Typography>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconButton onClick={decrementQuantity} style={{ color: "#FFD700" }} disabled={redirecting}>
                <Remove />
              </IconButton>
              <Typography variant="h6" style={{ color: "#fff" }}>
                {quantity}
              </Typography>
              <IconButton onClick={incrementQuantity} style={{ color: "#FFD700" }} disabled={redirecting}>
                <Add />
              </IconButton>
            </div>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <Button
                onClick={handleAddToCart}
                style={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  width: "100%",
                }}
                disabled={redirecting}
              >
                Agregar al Carrito
              </Button>
              <Button
                onClick={handleBuyNow}
                style={{
                  backgroundColor: "#43a047",
                  color: "#fff",
                  width: "100%",
                }}
                disabled={redirecting}
              >
                {redirecting ? "Procesando..." : "Comprar Ahora"}
              </Button>
            </div>
            <Typography style={{ color: "#fff", marginTop: "10px", textAlign: "center", fontSize: "0.8rem" }}>
              Envío desde GYM y devoluciones en 30 días.
            </Typography>
          </div>
        </>
      ) : (
        <Typography variant="h5" align="center" style={{ color: "#000" }}>
          Producto no encontrado
        </Typography>
      )}
    </div>
  )
}

export default ProductoDetalle

