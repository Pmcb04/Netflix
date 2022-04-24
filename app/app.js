// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import filmsRouter from './routes/filmsRouter.js';
import env from './config/environment.js'
import './utils/redis.js'

// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

// set up mongoose
mongoose.connect(env.mongodb.uri)
  .then(()=> {
    console.log('Database connected')
  })
  .catch((error)=> {
    console.log('Error connecting to database ', error)
  });
  
// set up port
const port = env.express.port;

// set up route
app.use("/api/films", filmsRouter)

app.post("/post", (req, res) => {
  console.log("Connected to React");
  res.redirect("/");
});

const server = app.listen(port, console.log(`Our server is running on port ${port}`));

// close server exit app
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})