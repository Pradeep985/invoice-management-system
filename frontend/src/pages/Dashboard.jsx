import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Card, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, InputAdornment, Dialog,
  DialogTitle, DialogContent, Divider, IconButton
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";

import PageContainer from "../components/common/PageContainer";

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/invoices");
        if (res.ok) {
          const data = await res.json();
          setInvoices(data);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) =>
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, invoices]);

  const handleOpen = (invoice) => setSelectedInvoice(invoice);
  const handleClose = () => setSelectedInvoice(null);

  return (
    <PageContainer>

      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h5">Dashboard</Typography>

        <TextField
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer component={Card} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredInvoices.length ? (
              filteredInvoices.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                      {row.invoice_number}
                  </TableCell>
                  <TableCell>{row.customer_name}</TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    ₹{parseFloat(row.grand_total).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<VisibilityOutlinedIcon />}
                      onClick={() => handleOpen(row)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No invoices found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

     <Dialog open={!!selectedInvoice} onClose={handleClose} fullWidth maxWidth="sm">
  {selectedInvoice && (
    <>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography fontWeight={700}>
            {selectedInvoice.invoice_number}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(selectedInvoice.created_at).toLocaleDateString()}
          </Typography>
        </Box>

        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>

        {/* Customer Info */}
        <Box mb={3}>
          <Typography fontWeight={600}>
            {selectedInvoice.customer_name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {selectedInvoice.customer_address}
          </Typography>

          <Box display="flex" gap={2} mt={1} flexWrap="wrap">
            <Typography variant="caption" color="text.secondary">
              PAN: {selectedInvoice.customer_pan || "N/A"}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              GST: {selectedInvoice.customer_gst || "Unregistered"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Items */}
        <Box mb={2}>
          {selectedInvoice.items_list.map((item, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              mb={1}
            >
              <Typography>
                {item.item_name} × {item.quantity}
              </Typography>
              <Typography>
                ₹{(item.quantity * item.price).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Summary */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>
              ₹{parseFloat(selectedInvoice.sub_total).toLocaleString()}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">GST</Typography>
            <Typography>
              ₹{parseFloat(selectedInvoice.tax_amount).toLocaleString()}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={700}>Total</Typography>
            <Typography fontWeight={700} color="primary">
              ₹{parseFloat(selectedInvoice.grand_total).toLocaleString()}
            </Typography>
          </Box>
        </Box>

      </DialogContent>
    </>
  )}
</Dialog>

    </PageContainer>
  );
};

export default Dashboard;