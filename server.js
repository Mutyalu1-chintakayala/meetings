// // Updated server.js with search functionality for meeting types

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const path = require('path');
// const Note = require('./models/Notes');
// const app = express();
// const PORT = 3000;
// // Connect to MongoDB
// mongoose.connect('mongodb+srv://chintakayalamutyalu:Demudu%4021@cluster0.mban80h.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));
// // User Schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   username: { type: String, unique: true },
//   email: { type: String, unique: true },
//   phone: String,
//   password: String
// });
// const User = mongoose.model('User', userSchema);

// // Routes
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// app.post('/index', async (req, res) => {
//   try {
//     const { name, username, email, phone, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: 'Email already registered' });

//     await new User({ name, username, email, phone, password }).save();
//     res.redirect('/login.html');
//   } catch (err) {
//     res.status(500).json({ error: 'Error signing up' });
//   }
// });

// // app.post('/login', async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email });
// //     if (!user || password !== user.password) {
// //       return res.status(401).json({ error: 'Invalid credentials' });
// //     }
// //     res.redirect('/main.html');
// //   } catch (err) {
// //     res.status(500).json({ error: 'Login failed' });
// //   }
// // });
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password, department } = req.body;
//     const user = await User.findOne({ email, department });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.redirect(`/${department.toLowerCase()}.html`);
//   } catch (err) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });


// // Handle Meeting Submission
// app.post('/submit-meeting', async (req, res) => {
//   try {
//     const { department, date, typeofmeeting, agenda, attendees, decision } = req.body;
//     await new Note({ department, date, typeofmeeting, agenda, attendees, decision }).save();
//     res.status(200).json({ message: 'Meeting saved successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Error saving meeting' });
//   }
// });
// // Forgot Password - Get password by email
// app.get('/get-password', async (req, res) => {
//   try {
//     const { email } = req.query;
//     const user = await User.findOne({ email });

//     if (user) {
//       res.json({ password: user.password });
//     } else {
//       res.status(404).json({ error: 'No user found with this email' });
//     }
//   } catch (err) {
//     console.error('Error fetching password:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



// // Get meeting records with search functionality
// // Get meeting records with enhanced search functionality
// app.get('/get-records', async (req, res) => {
//   try {
//     const { department, search } = req.query;
//     let query = { department };
    
//     if (search) {
//       // Enhanced search for specific meeting types
//       query.typeofmeeting = { 
//         $regex: search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 
//         $options: 'i' 
//       };
//     }
    
//     const records = await Note.find(query)
//       .sort({ date: -1 }) // Newest first
//       .limit(100); // Limit results for performance
    
//     res.json(records);
//   } catch (err) {
//     console.error('Error fetching records:', err);
//     res.status(500).json({ error: 'Error fetching records' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Note = require('./models/Notes');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://chintakayalamutyalu:Demudu%4021@cluster0.mban80h.mongodb.net/', {
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

// Updated Login Route (No department check)
app.post('/login', async (req, res) => {
  try {
    const { email, password,username } = req.body;
    const user = await User.findOne({ email,username});

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.redirect('/main.html'); // Redirect to main.html after successful login
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

// Forgot Password - Get password by email
app.get('/get-password', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (user) {
      res.json({ password: user.password });
    } else {
      res.status(404).json({ error: 'No user found with this email' });
    }
  } catch (err) {
    console.error('Error fetching password:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

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





