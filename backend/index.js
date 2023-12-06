const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const RegisterModel = require('./models/Register')
const app = express()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const fs = require ('fs')
const axios = require ('axios')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/test');
 
//TODO : ENCRYPT API KEY & KEY FOR LOCAL STORAGE (FOR SAFETY)
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

//Define Password Validity Function
function isPasswordValid(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  const isValid =
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasDigit &&
    hasSpecialChar;

  return isValid
};
//End definition - delete comments on merge

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await RegisterModel.findOne({
          $or: [{ email: email }, { name: name }],
        });
    
        if (existingUser) {
          res.status(409).json({ message: 'User already exists'});
        } 
        
        //Password invalidity logged to console
        else if (!isPasswordValid(password)){
          res.status(403).json({message: 'Invalid password. Please meet the specified requirements.'});
        }
        //End definition - delete comments on merge

        else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const emptyDashboard = "[]"
          const newUser = await RegisterModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            userDashboard: emptyDashboard,
          });
          const token = await jwt.sign({ email: newUser.email }, secretKey, {
            expiresIn: '1h', // Token expires in 1 hour, adjust as needed
          });
          res.status(201).json({ message: 'Account Created', token, user: newUser });

        }
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
});

app.post ('/autoProject', async (req, res) => {
  const { pdfText } = req.body; // Assuming the input is sent in the request body
  const passagePrompt = pdfText;

  const client = axios.create({
    headers: {
      Authorization: 'Bearer ' + OPENAI_API_KEY,
    },
  });

  const query = "From this project spec, please extract the project title, three overarching tasks, and 2-3 subtasks \
  for each of these tasks needed to complete the project. Return this information in \
  JSON string format where each project has a name (variable: name) and list of tasks (variable: lists), and each task \
  has a name (variable: name) and list of subtasks (variable: tasks), which also have a name (variable: name). Dont put \
  quotes around the variable names.";

  const params = {
    prompt: passagePrompt + '\n' + '"""' + '\n' + query,
    model: 'text-davinci-003',
    max_tokens: 1000,
    temperature: 0,
  };

  try {
    const result = await client.post('https://api.openai.com/v1/completions', params);
    res.status(200).json({ message: 'Success', result: result.data.choices[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
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
    console.log(user.name);
    res.status(200).json({ dashboard: dashboardData, name:user.name });

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
    res.status(500).json({message: 'Internal server error'});
  }

});


app.listen(3001, () => {
    console.log("Server is running")
})
