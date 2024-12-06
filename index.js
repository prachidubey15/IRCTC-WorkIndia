const express = require('express');
const dotenv = require('dotenv');
const adminRoute = require('./routes/admin.route')
const userRoute = require('./routes/user.route')

dotenv.config();

const server = express();
server.use(express.json());

server.use('/admin', adminRoute);
server.use('/user', userRoute);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));