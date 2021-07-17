const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

//import routes
const authRoutes  = require('./routes/auth');
const userRoutes  = require('./routes/user');

const app = express();

//db 
mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))
   
  mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
  });

  //middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());


//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening to port ${port}`));