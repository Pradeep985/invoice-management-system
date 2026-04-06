const pool = require('../config/db');

exports.getItems = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM items ORDER BY id DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

exports.createItem = async (req, res) => {
  const { name, selling_price, is_active } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO items (name, selling_price, is_active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        name,
        parseFloat(selling_price),
        is_active ?? true
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
};