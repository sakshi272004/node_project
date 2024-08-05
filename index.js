const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.static('public')); // Serve static files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    dob: Date,
    email: String,
    phno: String,
    gender: String,
    password: String,
    address: String,
    country: String,
    interests: String,
    education: String,
    occupation: String,
    communication: [String]
});

const User = mongoose.model('User', userSchema);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sakshidb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// POST route to handle form submission (Create)
app.post("/sign_up", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        age: req.body.age,
        dob: req.body.dob,
        email: req.body.email,
        phno: req.body.phno,
        gender: req.body.gender,
        password: req.body.password,
        address: req.body.address,
        country: req.body.country,
        interests: req.body.interests,
        education: req.body.education,
        occupation: req.body.occupation,
        communication: req.body.communication.split(',')
    });

    newUser.save()
        .then(user => {
            console.log("User data saved successfully:", user);
            res.redirect('signup_successful.html');
        })
        .catch(err => {
            console.error("Error saving user:", err);
            res.status(500).send('Error saving user to database');
        });
});

// Read all users
app.get("/users", (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Read a user by ID
app.get("/users/:id", (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Update a user by ID
app.put("/users/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) {
                res.json({ message: 'User deleted' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

// Root route to serve index.html
app.get("/", (req, res) => {
    res.redirect('index.html');
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
