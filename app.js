const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
//import routes
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

//routes middleware
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening to port ${port}`));