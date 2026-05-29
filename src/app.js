const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cookieParser = require('cookie-parser')

app.use(express.json())//middleware for json 
app.use(cookieParser())

app.use('/api',authRoutes) 
app.use('/api',productRoutes)

module.exports = app; 