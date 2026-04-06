import React, { useState, useEffect, useMemo } from "react";
import {Button, MenuItem, Box, Typography, Card, CardContent, Divider,IconButton, Grid, Dialog, DialogTitle,
   DialogContent, List,ListItemButton, ListItemAvatar, Avatar, ListItemText,Snackbar, Alert} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PageContainer from "../components/common/PageContainer";
import CustomInput from "../components/common/CustomInput";

const generateInvoiceId = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "INVC";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function Billing() {
  const [invoiceId, setInvoiceId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState([]);
  const [dbCustomers, setDbCustomers] = useState([]);
  const [dbItems, setDbItems] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setInvoiceId(generateInvoiceId());

    const fetchData = async () => {
      try {
        const [custRes, itemRes] = await Promise.all([
          fetch('${process.env.REACT_APP_API_URL}/api/customers'),
          fetch('${process.env.REACT_APP_API_URL}/api/items')
        ]);

        const customers = await custRes.json();
        const items = await itemRes.json();

        setDbCustomers(customers);
        setDbItems(items);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const handleCustomerSelect = (id) => {
    setSelectedCustomerId(id);
    setIsCustomerModalOpen(false);
  };

  const handleAddItem = () => {
    if (cart.length === 0) {
      setCart([{ itemId: "", quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleCartChange = (index, field, value) => {
    const updated = [...cart];
    updated[index][field] = value;
    setCart(updated);
  };

  const selectedCustomerData = dbCustomers.find(c => c.id === selectedCustomerId);
  const isGstApplied = selectedCustomerData && !selectedCustomerData.gst_no;

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const data = dbItems.find(i => i.id === item.itemId);
      const price = data ? parseFloat(data.selling_price) : 0;
      return total + price * (item.quantity || 1);
    }, 0);
  }, [cart, dbItems]);

  const taxAmount = isGstApplied ? subtotal * 0.18 : 0;
  const grandTotal = subtotal + taxAmount;

  const handleGenerateInvoice = async () => {
    if (cart.some(item => !item.itemId)) {
      setToast({ open: true, message: "Please select an item", severity: "error" });
      return;
    }

    const payload = {
      invoice_number: invoiceId,
      customer_id: selectedCustomerId,
      sub_total: subtotal,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      cart_items: cart.map(c => ({
        item_id: c.itemId,
        quantity: c.quantity,
        price: dbItems.find(i => i.id === c.itemId).selling_price
      }))
    };

    try {
      const response = await fetch("${process.env.REACT_APP_API_URL}/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setToast({ open: true, message: "Invoice Generated & Saved!", severity: "success" });
        setSelectedCustomerId("");
        setCart([]);
        setInvoiceId(generateInvoiceId());
      }
    } catch {
      setToast({ open: true, message: "Error saving invoice", severity: "error" });
    }
  };

  return (
    <PageContainer title="Create Invoice">

      <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={700}>Invoice Details</Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" mb={1} fontWeight={600}>
                Bill To *
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsCustomerModalOpen(true)}
                startIcon={<PersonOutlineIcon />}
                sx={{
                  justifyContent: "flex-start",
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: "grey.300",
                  bgcolor: "white"
                }}
              >
                {selectedCustomerData ? (
                  <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography fontWeight={700}>{selectedCustomerData.name}</Typography>
                  </Box>
                ) : (
                  "Select a customer to proceed..."
                )}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {selectedCustomerId && (
        <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>Line Items</Typography>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddItem}
                variant="contained"
                size="small"
                disabled={cart.length > 0}
              >
                Add Item
              </Button>
            </Box>

            {cart.length === 0 ? (
              <Box sx={{
                py: 4,
                textAlign: "center",
                bgcolor: "#f8fafc",
                borderRadius: 2,
                border: "1px dashed #cbd5e1"
              }}>
                <Typography color="text.secondary">No items added yet.</Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {cart.map((c, i) => (
                  <Box key={i} display="flex" gap={2} alignItems="center">

                    <Box flex={3}>
                      <CustomInput
                        select
                        label="Select Item"
                        value={c.itemId}
                        onChange={(e) => handleCartChange(i, "itemId", e.target.value)}
                        fullWidth
                      >
                        {dbItems.map(item => (
                          <MenuItem
                            key={item.id}
                            value={item.id}
                            disabled={!item.is_active}
                            sx={{ opacity: item.is_active ? 1 : 0.5 }}
                          >
                            {item.name} - ₹{item.selling_price}
                          </MenuItem>
                        ))}
                      </CustomInput>
                    </Box>

                    <Box flex={1}>
                      <CustomInput
                        type="number"
                        label="Qty"
                        value={c.quantity}
                        onChange={(e) =>
                          handleCartChange(i, "quantity", Number(e.target.value))
                        }
                        fullWidth
                      />
                    </Box>

                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(i)}
                      sx={{ mt: 1 }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>

                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {cart.length > 0 && selectedCustomerId && (
        <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "#f8fafc" }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Box width="100%" maxWidth="350px">

                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight={600}>₹{subtotal.toFixed(2)}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">
                    GST ({isGstApplied ? "18%" : "0%"})
                  </Typography>
                  <Typography fontWeight={600} color={isGstApplied ? "error.main" : "text.primary"}>
                    ₹{taxAmount.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={4}>
                  <Typography variant="h5" fontWeight={800}>Total Amount</Typography>
                  <Typography variant="h5" fontWeight={800} color="primary">
                    ₹{grandTotal.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleGenerateInvoice}
                  sx={{ py: 2, borderRadius: 2, fontWeight: 700 }}
                >
                  Finalize & Generate Invoice
                </Button>

              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Select Customer
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <List>
            {dbCustomers.map(c => (
              <ListItemButton
                key={c.id}
                disabled={!c.is_active}
                onClick={() => c.is_active && handleCustomerSelect(c.id)}
                sx={{ py: 2, opacity: c.is_active ? 1 : 0.5 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {c.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={c.name}
                  primaryTypographyProps={{
                    color: c.is_active ? "text.primary" : "text.disabled"
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ fontWeight: 600 }}>
          {toast.message}
        </Alert>
      </Snackbar>

    </PageContainer>
  );
}
