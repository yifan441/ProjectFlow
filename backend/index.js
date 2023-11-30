const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const RegisterModel = require('./models/Register')
const app = express()
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')
const fs = require ('fs')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/test');

const secretJson = fs.readFileSync('secret.json', 'utf8');
const secretObject = JSON.parse(secretJson);
const secretKey = secretObject.secretKey;

const verifyToken = (req, res, next) => {
  
  const authToken = req.headers.authorization?.split(' ')[1];

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(authToken, secretKey);
    req.user = decoded; // Attach user information to the request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token is not valid' });
  }
};

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
          const emptyDashboard = "[]"
          const newUser = await RegisterModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            userDashboard: emptyDashboard,
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

    const user = await RegisterModel.findOne({ email });

    if (user) {

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ email: user.email }, secretKey, {
          expiresIn: '1h', // Token expires in 1 hour, adjust as needed
        });

        res.status(200).json({ message: 'Login successful', token, user });
      } else {

        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {

      res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {

    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/user/dashboard', verifyToken, async (req, res) => {
  const userEmail = req.user.email;
  try {

    const user = await RegisterModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dashboardData = JSON.parse(user.userDashboard)
    res.status(200).json({ dashboard: dashboardData });

  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/user/updateDashboard', verifyToken, async (req, res) => {
  const userEmail = req.user.email; 
  const updatedProjectData = req.body.updatedProjectData;

  try {
    const user = await RegisterModel.findOne({email : userEmail});

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
  user.userDashboard = updatedProjectData;
  await user.save();

  res.status(200).json({message: 'User dashboard updated successfully'});
  } catch (error) {
    console.error('Error updating user dashboard:', error);
    res.status(500).json({message: 'Internal server error'});
  }

});


app.listen(3001, () => {
    console.log("Server is running")
})