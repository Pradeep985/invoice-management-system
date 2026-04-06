const pool = require('../config/db');

exports.getCustomers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM customers ORDER BY id DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

exports.createCustomer = async (req, res) => {
  const { name, address, pan, gst_no, is_active } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO customers (name, address, pan, gst_no, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name,
        address || null,
        pan || null,
        gst_no || null,
        is_active ?? true
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
};