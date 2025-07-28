// Updated server.js with search functionality for meeting types

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Note = require('./models/Notes');
const app = express();
const PORT = 3000;
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/meetings', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  phone: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.post('/index', async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    await new User({ name, username, email, phone, password }).save();
    res.redirect('/login.html');
  } catch (err) {
    res.status(500).json({ error: 'Error signing up' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.redirect('/main.html');
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Handle Meeting Submission
app.post('/submit-meeting', async (req, res) => {
  try {
    const { department, date, typeofmeeting, agenda, attendees, decision } = req.body;
    await new Note({ department, date, typeofmeeting, agenda, attendees, decision }).save();
    res.status(200).json({ message: 'Meeting saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving meeting' });
  }
});


// Get meeting records with search functionality
// Get meeting records with enhanced search functionality
app.get('/get-records', async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = { department };
    
    if (search) {
      // Enhanced search for specific meeting types
      query.typeofmeeting = { 
        $regex: search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 
        $options: 'i' 
      };
    }
    
    const records = await Note.find(query)
      .sort({ date: -1 }) // Newest first
      .limit(100); // Limit results for performance
    
    res.json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ error: 'Error fetching records' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


