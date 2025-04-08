import React, { useState, useEffect } from "react";
import { Box, TextField, IconButton, MenuItem, Select, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();

  // Cargar categorías desde la base de datos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("No se encontró un token de autenticación.");

        const response = await fetch("http://localhost:3005/api/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al cargar las categorías.");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error.message);
      }
    };

    fetchCategories();
  }, []);

  // Cargar productos desde la base de datos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("No se encontró un token de autenticación.");

        const response = await fetch("http://localhost:3005/api/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al cargar los productos.");

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error.message);
      }
    };

    fetchProducts();
  }, []);

  // Manejar cambios en el término de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filtrar productos por nombre y categoría
    const filtered = products
      .filter((product) => {
        const matchesName = product.name.toLowerCase().includes(term);
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesName && matchesCategory;
      })
      .slice(0, 4); // Mostrar solo los 4 productos más cercanos

    setFilteredProducts(filtered);
  };

  // Manejar cambios en la categoría seleccionada
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    // Filtrar productos por categoría y término de búsqueda
    const filtered = products
      .filter((product) => {
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category ? product.category === category : true;
        return matchesName && matchesCategory;
      })
      .slice(0, 4); // Mostrar solo los 4 productos más cercanos

    setFilteredProducts(filtered);
  };

  // Manejar clic en "Ver más"
  const handleViewMore = (productId) => {
    setSearchTerm(""); // Limpiar el término de búsqueda
    router.push(`/producto?id=${productId}`); // Redirigir a la página del producto
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Barra de búsqueda con selector de categorías */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFF",
          borderRadius: 1,
          width: "100%",
          paddingX: 1,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{
            minWidth: "120px",
            marginRight: 1,
            backgroundColor: "#FFF",
            borderRadius: 1,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <MenuItem value="">
            <em>Todas las categorías</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          placeholder="Buscar productos..."
          variant="standard"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{ disableUnderline: true }}
          sx={{ flexGrow: 1 }}
        />
        <IconButton color="primary">
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Resultados de búsqueda flotantes */}
      {searchTerm && (
        <List
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "#FFF",
            borderRadius: 1,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {filteredProducts.map((product) => (
            <ListItem
              key={product._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingY: 1,
              }}
            >
              <ListItemText
                primary={product.name}
                primaryTypographyProps={{ color: "black", fontWeight: "bold" }}
                secondary={`$${product.price.toFixed(2)}`}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewMore(product._id)} // Llama a la función para limpiar y redirigir
              >
                Ver más
              </Button>
            </ListItem>
          ))}
          {filteredProducts.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginTop: 2, textAlign: "center", width: "100%" }}
            >
              No se encontraron productos.
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
};

export default SearchBar;