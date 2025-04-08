import React, { useContext } from 'react';
import { AppBar, Toolbar, Box, Button, IconButton } from '@mui/material';
import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'; // Ícono para "Mis Compras"
import { AuthContext } from '../../context/AuthContext';

import MiniCart from './MiniCart'; // Asegúrate de que esta ruta sea correcta

const NavBar = () => {
  const { isAuthenticated, user } = useContext(AuthContext); // Ahora obtenemos el usuario

  return (
    <AppBar 
      position="static"  
      sx={{ 
        backgroundColor: '#DC143CF1', 
        boxShadow: 'none', 
        padding: 0, 
        margin: 0,
        width: { xs: '100%', md: '100%' }, // Reduce el ancho en pantallas grandes
        marginX: 'auto', // Centra el NavBar horizontalmente
      }}
    >
      <Toolbar 
        sx={{  
          display: 'flex',  
          justifyContent: 'space-between',  
          alignItems: 'center',
          padding: 0,
          margin: 0,
          width: '100%',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            onClick={() => { window.location.href = '/homepage'; }} 
            sx={{ padding: 0, minWidth: 'unset' }}
          >
            <img 
              src="https://i.imgur.com/MFItI2Q.png" 
              alt="Gladiator Gym Logo" 
              style={{ height: '55px', width: 'auto' }} 
            />
          </Button>
        </Box>

        {/* Barra de búsqueda centrada */}
        <Box  
          sx={{
            flexGrow: 1,  
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SearchBar />
        </Box>

        {/* Elementos a la derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isAuthenticated && (
            <>
              <Button href="/auth/login" color="inherit" sx={{ color: '#FFFFFF', textTransform: 'none' }}>
                Iniciar Sesión
              </Button>
              <Button href="/auth/register" color="inherit" sx={{ color: '#FFFFFF', textTransform: 'none' }}>
                Registrarse
              </Button>
            </>
          )}
          {isAuthenticated && <ProfileMenu />}
          
          {/* Componente MiniCart */}
          <MiniCart />

          {/* Ícono para "Mis Compras" */}
          <IconButton 
            onClick={() => { window.location.href = '/miscompras'; }} 
            sx={{ color: '#FFFFFF' }}
          >
            <ShoppingBagIcon sx={{ height: '32px', width: '32px' }} />
          </IconButton>
        </Box>

        {/* Botón hamburguesa (Solo si el usuario es admin) */}
        {isAuthenticated && user?.role === "admin" && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => { window.location.href = '/dashboard'; }} 
              sx={{ color: '#FFFFFF' }}
            >
              <MenuIcon sx={{ height: '32px', width: '32px' }} />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;