const express =require('express')
const app= express()
const dotenv= require('dotenv')
const mongoose= require("mongoose")
const cors= require("cors")
const cookieParser = require('cookie-parser')
const logger = require('morgan');
const bodyParser = require('body-parser');
const postroute= require('./routes/posts')
dotenv.config()

app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use(express.json())
mongoose
  .connect(process.env.MongoDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(console.log("MongoDB database has been connected successfully."))
.catch(err => {
  console.log("Cannot connect to the database!", err);
  process.exit();
});

app.get('/', (req, res) => {
    res.send('Hello World! Akash is here')
  })

  app.use("/blog/post", postroute)
  
  app.listen(3000, () => {
    console.log("Backend server is running...")
  })