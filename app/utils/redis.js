import mongoose from 'mongoose';
import redis from "redis";
import util from "util";
import env from '../config/environment.js'

export const client = redis.createClient({
  host: env.redis.host,
  port: env.redis.port,
  legacyMode: true,
  retry_strategy: () => 1000
});

await client.connect()

client.hGet = util.promisify(client.hGet);
client.hGetAll = util.promisify(client.hGetAll);
client.zCard = util.promisify(client.zCard);
client.hLen = util.promisify(client.hLen)
client.exists = util.promisify(client.exists)
client.zPopMin = util.promisify(client.zPopMin)
client.ttl = util.promisify(client.ttl)
client.zScore = util.promisify(client.zScore)
client.zRem = util.promisify(client.zRem)

const exec = mongoose.Query.prototype.exec;
export const setKey = "set"
const time = 60
const MAX_CACHE_ITEMS = 30

mongoose.Query.prototype.cache = function() {
  this.useCache = true;

  return this;
};


function calculateHeuristics(request, ttl) {
  return request * ttl
}

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return await exec.apply(this, arguments);
  }

  var filmKey = this.getQuery(); // {"show_id" : "s34"}
  filmKey = filmKey["show_id"]; // "s34"

  console.log("\n**************************")
  console.log("FILMKEY -> ", filmKey)

  const cacheValue = await client.exists(filmKey); // comprobamos que la pelicula esta en cache

  console.log("IN CACHE? -> ", cacheValue)

  var number_films_cache = await client.zCard(setKey)
  console.log("en el set hay ", number_films_cache )

  if (cacheValue) {
    var requests = JSON.parse(await client.hGet(filmKey, "requests")); // obtenemos el numero de peticiones 
    client.hSet(filmKey, "requests", JSON.stringify(requests + 1)); // aumentamos en uno el numero de peticicones 
    client.expire(filmKey, time) // volvemos a ponerle time de vida a la pelicula que se acaba de pedir

    client.zIncrBy(setKey, 1, filmKey) // ponemos la nueva euristica en el set para esa pelicula en concreto

    var film = await client.hGetAll(filmKey) // obtenemos la pelicula completa

    // preparamos para devolver en formato json
    var json = {}
    for (let i = 0; i < film.length; i += 2) {
      json[film[i]] = film[i+1]
    }

    console.log("Response from Redis");
    console.log("**************************")

    // devolvemos la pelicula
    return Array.isArray(json)
      ? json.map(d => new this.model(d))
      : new this.model(json);
  }

  var result = await exec.apply(this, arguments);

  result[0]["requests"] = 1 // ponemos que la pelicula ha recibido una peticion

  // obtenemos todas las keys de result[0] (respuesta de MongoDB)
  var keys = []
  for(var i in result[0]){
    keys.push(i)
  }

  // cogemos solo las caracteristicas de la pelicula
  keys = keys.slice(5,17)

  // creamos el hash para esa pelicula separando cada atributo
  keys.forEach(key => {
      client.hSet(filmKey, key, JSON.stringify(result[0][key]))
  });

  // client.hSet(hashKey, filmKey, film_JSON); // creamos el hash para almacenar las peliculas
  client.zAdd(setKey, 1, filmKey) // actualizamos en la tabla de clasificación esa película

 
  if(number_films_cache >= MAX_CACHE_ITEMS ){
    const element_del = await client.zPopMin(setKey) // quitamos el elemento mas bajo en la tabla de clasificación
    console.log("HASH ", element_del[0], " EXISTE ANTES BORRAR ", await client.exists(element_del[0]))
    await client.del(element_del[0]) // Borramos tambien el elemento en el hash
    console.log("element deleted ", element_del[0])
    console.log("HASH ", element_del[0], " EXISTE DESPUES BORRAR ", await client.exists(element_del[0]))
    number_films_cache = await client.zCard(setKey) 
    console.log("en el set hay despues de borrar", number_films_cache)
  }
 

  client.expire(filmKey, time); // ponemos un tiempo para que se borre el hash al finalizarlo

  // recalculamos la heuristica de toda la tabla de clasificación
  await client.zRange(setKey, 0, -1,  async function (err, list ) {
    if (err) throw err;

    for(let i in list.reverse()){

        var ttl = await client.ttl(list[i])
        var heuristics = 0
        if(ttl == -2){ // ya no existe el elemento
          var number = await client.zRem(setKey, list[i]) // borramos del dataset el elemento ya que no existe
          console.log("borrado? ", number, " elemento del dataset por no existir ", list[i])
        }else{
          heuristics = calculateHeuristics(await client.hGet(list[i], "requests"), ttl)  // recalculamos la heuristica en cada fase
          await client.zIncrBy(setKey, heuristics, list[i]) // incrementamos con la nueva heuristica
        }
        
        // Descomentar para ver scores de la tabla de clasificación   
        // console.log(i, " : " , list[i], " : ", await client.zScore(setKey, list[i]))
    }

  });

  console.log("Response from MongoDB");
  console.log("**************************")

  return result[0];
};


export function clearKey(hashKey) {
  client.del(JSON.stringify(hashKey));
}