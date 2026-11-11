const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// ---------- database = db.json file ----------
if (!fs.existsSync('db.json')) {
  fs.writeFileSync('db.json', JSON.stringify({ menu: [], orders: [] }));
}
const read = () => JSON.parse(fs.readFileSync('db.json'));
const write = (data) => fs.writeFileSync('db.json', JSON.stringify(data));

// ---------- DASHBOARD ----------
app.get('/stats', (req, res) => {
  const db = read();
  const sales = db.orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);
  res.json({
    menuCount: db.menu.length,
    orderCount: db.orders.length,
    totalSales: sales
  });
});

// ---------- MENU ----------
// GET /menu  or  GET /menu?q=biryani  (search)
app.get('/menu', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const list = read().menu.filter(m => m.name.toLowerCase().includes(q));
  res.json(list);
});

app.post('/menu', (req, res) => {
  const db = read();
  db.menu.push({
    id: Date.now(),
    name: req.body.name,
    category: req.body.category || 'Other',
    price: Number(req.body.price)
  });
  write(db);
  res.json({ ok: true });
});

app.delete('/menu/:id', (req, res) => {
  const db = read();
  db.menu = db.menu.filter(m => m.id != req.params.id);
  write(db);
  res.json({ ok: true });
});

// ---------- ORDERS ----------
app.get('/orders', (req, res) => res.json(read().orders));

app.post('/orders', (req, res) => {
  const db = read();
  const item = db.menu.find(m => m.id == req.body.itemId);
  if (!item) return res.status(400).json({ error: 'Select a food item' });
  const qty = Number(req.body.qty);
  db.orders.push({
    id: Date.now(),
    customer: req.body.customer || req.body.table,
    item: item.name,
    qty: qty,
    total: item.price * qty,
    status: 'Preparing'
  });
  write(db);
  res.json({ ok: true });
});

// update status: Preparing / Completed
app.put('/orders/:id', (req, res) => {
  const db = read();
  const order = db.orders.find(o => o.id == req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;
  write(db);
  res.json({ ok: true });
});

app.delete('/orders/:id', (req, res) => {
  const db = read();
  db.orders = db.orders.filter(o => o.id != req.params.id);
  write(db);
  res.json({ ok: true });
});

// ---------- START ----------
app.listen(3000, () => {
  console.log('Running at http://localhost:3000');
  if (process.platform === 'win32') exec('start http://localhost:3000');
});
