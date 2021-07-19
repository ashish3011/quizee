const express = require('express');
const mongoose= require('mongoose');
const { readdirSync } = require("fs");
const bodyParser = require('body-parser')
const morgan = require("morgan");
const url = require('url-parse');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path=require('path');

require('dotenv').config()   //import .env 

const app= express();
const port=process.env.PORT;

app.use(cors())
app.use(morgan("dev"));
app.use(cookieParser())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

  


  readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));
  app.use(express.static(path.join(__dirname, 'build')));


  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.listen(port,()=>console.log(`server is running at port ${port}`));


