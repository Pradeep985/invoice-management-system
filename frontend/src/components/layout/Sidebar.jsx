import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import ReceiptIcon from "@mui/icons-material/Receipt";

const menuItems = [
  { title: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { title: "Master", path: "/master", icon: <StorageIcon /> },
  { title: "Billing", path: "/billing", icon: <ReceiptIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box 
      sx={{ 
        width: 240, 
        height: "100vh", 
        backgroundColor: "#f9fafb",
        borderRight: "1px solid #e5e7eb",
        px: 2,
        py: 3
      }}
    >
      <List>
        {menuItems.map((item) => {
          const isActive = item.path === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.title}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: isActive ? "#eff6ff" : "transparent",
                color: isActive ? "#2563eb" : "#4b5563",
                "&:hover": {
                  backgroundColor: isActive ? "#eff6ff" : "#f3f4f6",
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40, 
                  color: isActive ? "#2563eb" : "#9ca3af" 
                }}
              >
                {item.icon}
              </ListItemIcon>
              
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.875rem"
                }} 
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}