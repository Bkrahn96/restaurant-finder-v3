// functions/fetchRestaurants.js
const fetch = require('node-fetch');

module.exports = function fetchRestaurants(lat, lon, type, maxDistance) {
    const url = `/.netlify/functions/getRestaurants?lat=${lat}&lon=${lon}&type=${type}&maxDistance=${maxDistance}`;
    return fetch(url).then(response => response.json());
};
