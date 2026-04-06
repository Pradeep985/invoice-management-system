const pool = require('../config/db');

exports.getInvoices = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        i.*, 
        c.name AS customer_name,
        c.address AS customer_address,
        c.pan AS customer_pan,
        c.gst_no AS customer_gst,
        json_agg(
          json_build_object(
            'item_name', items.name,
            'quantity', ii.quantity,
            'price', ii.price
          )
        ) AS items_list
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      JOIN invoice_items ii ON i.id = ii.invoice_id
      JOIN items ON ii.item_id = items.id
      GROUP BY i.id, c.id
      ORDER BY i.created_at DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

exports.createInvoice = async (req, res) => {
  const { invoice_number, customer_id, sub_total, tax_amount, grand_total, cart_items } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO invoices (invoice_number, customer_id, sub_total, tax_amount, grand_total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        invoice_number,
        parseInt(customer_id),
        parseFloat(sub_total),
        parseFloat(tax_amount),
        parseFloat(grand_total)
      ]
    );

    const invoice = rows[0];

    for (const item of cart_items) {
      await client.query(
        `INSERT INTO invoice_items (invoice_id, item_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [
          invoice.id,
          parseInt(item.item_id),
          parseInt(item.quantity),
          parseFloat(item.price)
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json(invoice);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Invoice Creation Error:", error);
    res.status(500).json({ error: "Failed to generate invoice" });
  } finally {
    client.release();
  }
};