const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const RegisterModel = require('./models/Register')
const app = express()
const bcrypt = require ('bcrypt')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/test');

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await RegisterModel.findOne({
          $or: [{ email: email }, { name: name }],
        });
    
        if (existingUser) {
          res.status(409).json({ message: 'User already exists'});
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await RegisterModel.create({
            name: name,
            email: email,
            password: hashedPassword,
          });
          res.status(201).json({ message: 'Account Created', user: newUser });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await RegisterModel.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Successful login
        res.status(200).json({ message: 'Login successful', user });
      } else {
        // Incorrect password
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      // User not found
      res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    // Server error
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.listen(3001, () => {
    console.log("Server is running")
})