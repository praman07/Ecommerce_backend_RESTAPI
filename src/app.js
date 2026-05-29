const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const errorMiddleware = require('./middleware/error.middleware');
const cookieParser = require('cookie-parser')

app.use(express.json())//middleware for json 
app.use(cookieParser())

app.use('/api',authRoutes) 
app.use('/api',productRoutes)

// Centralized error handler
app.use(errorMiddleware);

module.exports = app; 