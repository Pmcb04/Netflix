import mongoose from 'mongoose';
import redis from "redis";
import util from "util";
import Film from "../models/film.js"
import env from '../config/environment.js'

const client = redis.createClient({
  host: env.redis.host,
  port: env.redis.port,
  legacyMode: true,
  retry_strategy: () => 1000
});

await client.connect()

client.hGet = util.promisify(client.hGet);
const exec = mongoose.Query.prototype.exec;
const hashKey = "hash" 
const setKey = "set"

mongoose.Query.prototype.cache = function(options = { time: 60 }) {
  this.useCache = true;
  this.time = options.time;

  return this;
};


export function getBetterFilms(res, req) {

  client.zRange(setKey, 0, -1, "withscores",  function (err, list  ) {
    if (err) throw err;
    console.log("with scores:", list.reverse().slice(0, 20)); 
  });

}

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return await exec.apply(this, arguments);
  }

  var filmKey = this.getQuery(); // {"show_id" : "s34"}
  filmKey = filmKey["show_id"]; // "s34"

  console.log("\n**************************")
  console.log("FILMKEY -> ", filmKey)

  const cacheValue = await client.hGet(hashKey, filmKey);

  console.log("IN CACHE? -> ", cacheValue)

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    client.zIncrBy(setKey, 1, doc["show_id"])

    console.log("Response from Redis");
    console.log("**************************")

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  var result = await exec.apply(this, arguments);

  client.hSet(hashKey, filmKey, JSON.stringify(result[0])); // creamos el hash para almacenar las peliculas
  client.zAdd(setKey, 1, filmKey) // actualizamos en la tabla de clasificación esa película

  //client.expire(hashKey, this.time); // ponemos un tiempo para que se borre el hash al finalizarlo
  //client.expire(setKey, this.time); // ponemos un tiempo para que se borre el set al finalizarlo

  console.log("Response from MongoDB");
  console.log("**************************")

  return result;
};

export function clearKey(hashKey) {
  client.del(JSON.stringify(hashKey));
}