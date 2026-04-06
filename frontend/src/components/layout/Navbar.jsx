import React from "react";
import { AppBar, Toolbar, Typography} from "@mui/material";

export default function Navbar() {
  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: "#ffffff", 
        borderBottom: "1px solid #e5e7eb",
        color: "#111827" 
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          LogiEdge <span style={{ color: "#2563eb" }}>Billing</span>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}