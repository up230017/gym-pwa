import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Search as SearchIcon, BarChart as BarChartIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import Link from 'next/link';

const NavMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Búsqueda Avanzada', icon: <SearchIcon />, link: '/search' },
    { text: 'Sales Pipeline', icon: <BarChartIcon />, link: '/sales-pipeline' },
    { text: 'Gestión de Casos de Soporte', icon: <NotificationsIcon />, link: '/support-cases' },
    { text: 'Reportes & Analytics', icon: <BarChartIcon />, link: '/reports' },
    { text: 'Notificaciones', icon: <NotificationsIcon />, link: '/notifications' },
  ];

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} component={Link} href={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavMenu;