const fetch = require('node-fetch');

module.exports = async function fetchRestaurants(lat, lon, type, maxDistance, apiKey) {
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${maxDistance * 1609.34}&type=restaurant&key=${apiKey}`;
    let url = baseUrl;
    let allResults = [];
    let nextPageToken = null;

    do {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error(data.status);
        }
        allResults = allResults.concat(data.results);
        nextPageToken = data.next_page_token;
        if (nextPageToken) {
            url = `${baseUrl}&pagetoken=${nextPageToken}`;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Google Places API requires a short delay before fetching the next page
        }
    } while (nextPageToken);

    return allResults;
};
