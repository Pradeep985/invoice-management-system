import React, { useState, useEffect } from "react";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Box, Grid, Card, CardContent, Typography,
  Chip, InputAdornment, Divider, Snackbar, Alert
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PageContainer from "../components/common/PageContainer";

const Items = () => {
  const [open, setOpen] = useState(false);
  const [itemList, setItemList] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "Active"
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        if (response.ok) {
          const data = await response.json();
          setItemList(data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", price: "", status: "Active" });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price) {
      setToast({
        open: true,
        message: "Item Name and Price are required!",
        severity: "error"
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        selling_price: Number(formData.price),
        is_active: formData.status === "Active"
      };

      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newItem = await response.json();
        setItemList([newItem, ...itemList]);
        handleClose();

        setToast({
          open: true,
          message: "Item added successfully!",
          severity: "success"
        });
      }
    } catch {
      setToast({
        open: true,
        message: "Failed to connect to server.",
        severity: "error"
      });
    }
  };

  return (
    <PageContainer title="Items">

      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Add Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {itemList.map((item, index) => {
          const status = item.is_active === false ? "Inactive" : "Active";

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || index}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  width: "250px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease-in-out",
                  border: "1px solid #f3f4f6",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    borderColor: "#e5e7eb"
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      lineHeight={1.2}
                      noWrap
                    >
                      {item.name}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={1}
                  >
                    ₹{item.selling_price || item.price}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: "#f3f4f6" }} />

                  <Box display="flex" justifyContent="flex-end">
                    <Chip
                      label={status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        bgcolor: status === "Active" ? "#dcfce7" : "#f1f5f9",
                        color: status === "Active" ? "#166534" : "#475569",
                        borderRadius: 1.5
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Add New Item
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Item Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                )
              }}
            />

            <TextField
              select
              label="Status"
              fullWidth
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save Item
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </PageContainer>
  );
};

export default Items;