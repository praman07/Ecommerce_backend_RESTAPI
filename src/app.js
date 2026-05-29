const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');

app.use(express.json())//middleware for json 


app.use('/api',authRoutes) 

module.exports = app; 