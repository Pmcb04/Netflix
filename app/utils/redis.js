import mongoose from 'mongoose';
import redis from "redis";
import util from "util";
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

mongoose.Query.prototype.cache = function(options = { time: 60 }) {
  this.useCache = true;
  this.time = options.time;
  this.hashKey = JSON.stringify(this.mongooseCollection.name);

  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return await exec.apply(this, arguments);
  }

  const key = JSON.stringify({
    ...this.getQuery()
  });

  const cacheValue = await client.hGet(this.hashKey, key);
  
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    console.log("Response from Redis");
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  var result = await exec.apply(this, arguments);

  result = result.map(d => new this.model(d))

  client.hSet(this.hashKey, key, JSON.stringify(result)); // creamos el hash para almacenar las peliculas
  client.expire(this.hashKey, this.time); // ponemos un tiempo para que se borre el hash al finalizarlo

  console.log("Response from MongoDB");
  return result;
};

export function clearKey(hashKey) {
  client.del(JSON.stringify(hashKey));
}