import React, { useState, useEffect } from "react";
import {
  Button, Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Box, Grid, Card, CardContent,
  IconButton, Typography, Chip, Divider,
  Snackbar, Alert
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import PageContainer from "../components/common/PageContainer";

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pan: "",
    gst_no: "",
    status: "Active"
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error"
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log("Current API URL being used:", process.env.REACT_APP_API_URL);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers`);
        if (response.ok) {
          const data = await response.json();
          setCustomerList(data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      address: "",
      pan: "",
      gst_no: "",
      status: "Active"
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.pan) {
          setToast({
            open: true,message: "Fill the required details",severity: "error"});
          return;
        }

    if (formData.pan.length !== 10) {
      setToast({
        open: true,message: "Fill the correct PAN Number",severity: "error"});
      return;
    }
   
    if (formData.gst_no.length > 0 && formData.gst_no.length !== 15) {
      setToast({
        open: true,
        message: "Fill the correct GST Number.",
        severity: "error"
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        pan: formData.pan,
        gst_no: formData.gst_no.trim() === "" ? null : formData.gst_no,
        is_active: formData.status === "Active"
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newCustomer = await response.json();
        setCustomerList([newCustomer, ...customerList]);
        handleClose();
        setToast({
          open: true,
          message: "New customer added successfully!",
          severity: "success"
        });
      }
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  return (
    <PageContainer title="Customers">

      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Add customers
        </Button>
      </Box>

      <Grid container spacing={3}>
        {customerList.map((customer, index) => {
          const status = customer.is_active === false ? "Inactive" : "Active";

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={customer.id || index}>
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
                      {customer.name}
                    </Typography>
                  </Box>

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
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            backgroundImage: "none"
          }
        }}
      >
        <DialogTitle
          sx={{
            px: 4,
            pt: 4,
            pb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            New Customer
          </Typography>

          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <form onSubmit={handleSave} noValidate>
          <DialogContent sx={{ px: 4, py: 4, overflow: "hidden" }}>
            <Grid container spacing={3}>

              <Grid item xs={12} sm={8}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  required
                  size="small"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="PAN Number"
                  fullWidth
                  required
                  size="small"
                  value={formData.pan}
                  onChange={(e) =>
                    setFormData({ ...formData, pan: e.target.value.toUpperCase() })
                  }
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Registered Address"
                  fullWidth
                  required
                  size="small"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="GST Number"
                  fullWidth
                  size="small"
                  value={formData.gst_no}
                  onChange={(e) =>
                    setFormData({ ...formData, gst_no: e.target.value.toUpperCase() })
                  }
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Status"
                  fullWidth
                  required
                  size="small"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>

            </Grid>
          </DialogContent>

          <Box
            sx={{
              px: 4,
              py: 2.5,
              bgcolor: "#fafafa",
              borderTop: "1px solid #eaeaea",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5
            }}
          >
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              Confirm & Save
            </Button>
          </Box>
        </form>
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
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </PageContainer>
  );
};

export default Customers;
