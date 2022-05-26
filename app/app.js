// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import filmsRouter from './routes/filmsRouter.js';
import env from './config/environment.js'
import './utils/redis.js'
import { setKey } from './utils/redis.js';
import { client } from './utils/redis.js';

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


app.get('/api/better',async(req, res)=>{

  var list_better_films = []

  await client.zRange(setKey, 0, -1, async function (err, list ) { // cogemos solo las 10 primeras peliculas
    if (err) throw err;

    for (let i in list.reverse()) {

      var film = await client.hGetAll(list[i]) // obtenemos la pelicula completa

      if(!isObjEmpty(film)){
          // preparamos para devolver en formato json
          var json = {}
          for (let i = 0; i < film.length; i += 2) {
              json[film[i]] = film[i+1]
          }

          list_better_films[i] = json
      }
      
    }


    if (list_better_films)
      return res.status(200).send(list_better_films)

  });

})


const server = app.listen(port, console.log(`Our server is running on port ${port}`));

// close server exit app
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})

function isObjEmpty(obj) {
  return Object.keys(obj).length === 0;
}