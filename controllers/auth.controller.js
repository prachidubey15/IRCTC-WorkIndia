const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');


//Register User controller
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findUserByEmail(email);
    if (userExist) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(name, email, hashedPassword);
    const savedUser = await newUser.save();

    console.log('User registered successfully: ', savedUser.insertId);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error while registering user:', error.message);
    res.status(500).json({ message: 'Error while registering user' });
  }
};


//Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      console.log('Incorrect password:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful');
    res.status(201).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Error during log in' });
  }
};