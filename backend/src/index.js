const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'super_secret_key'; // You should store this in environment variables

app.use(cors());
app.use(express.json());

// In-memory stores
let users = [];
let listings = [
  {
    id: 1,
    title: "Michelin Pilot Sport 4S",
    brand: "Michelin",
    size: "225/45R17",
    condition: "Used - Good",
    treadDepth: "6/32",
    price: 300,
    location: "Los Angeles, CA",
    description: "Set of 4 tires, great grip, 60% tread left.",
    images: ["https://example.com/tire1.jpg"],
    datePosted: new Date().toISOString()
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// --- AUTH ROUTES ---

// Register user
app.post('/api/register', async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email && !phone || !password) {
    return res.status(400).json({ error: 'Email or phone and password are required' });
  }

  const existingUser = users.find(
    u => u.email === email || u.phone === phone
  );
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    phone,
    password: hashedPassword
  };
  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login user
app.post('/api/login', async (req, res) => {
  const { email, phone, password } = req.body;
  const user = users.find(
    u => u.email === email || u.phone === phone
  );
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '2h' });
  res.json({ message: 'Login successful', token });
});

// --- LISTING ROUTES ---

// Get all listings
app.get('/api/listings', (req, res) => {
  res.json(listings);
});

// Get listing by ID
app.get('/api/listings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const listing = listings.find(item => item.id === id);
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).json({ error: "Listing not found" });
  }
});

// Create new listing (auth not required yet)
app.post('/api/listings', (req, res) => {
  const newListing = {
    id: listings.length + 1,
    datePosted: new Date().toISOString(),
    ...req.body
  };
  listings.push(newListing);
  res.status(201).json(newListing);
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
