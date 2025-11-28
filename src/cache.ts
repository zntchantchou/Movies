import MemCached from "memcached";

const cache = new MemCached("127.0.0.1:3003", {
  namespace: "movie",
  maxKeySize: 20,
  maxExpiration: 12 * 60 * 60,
});

export default cache;
