// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import filmsRouter from './routes/filmsRouter.js';
import env from './config/environment.js'



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
const port = 3000;

// set up route
app.use("/api/films", filmsRouter)

const server = app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});

// close server exit app
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})