const lru_Cache= require("lru-cache");

const options={ 
    max: 500
    , length: function (n, key) { return n * 2 + key.length }
    , dispose: function (key, n) { n=""; }
    , maxAge: 1000 * 60 * 60 
};

const cache = new lru_Cache(options);

const otherCache = new lru_Cache(50) // sets just the max size

module.exports = cache;
