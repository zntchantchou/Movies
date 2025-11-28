import nodeCache from "node-cache";

// movie details get cached for 12 hours

const ttl = 60 * 60 * 12; // testing
const cache = new nodeCache({ stdTTL: ttl, checkperiod: ttl });

cache.on("expired", function (k, v) {
  console.log("[CACHE EXPIRATION] key: ", k, " value: ", v);
  cache.del(k);
});

export default cache;
