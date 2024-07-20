// getRestaurants.js
const fetch = require('node-fetch');
const fastFoodFilter = require('./filters/fastFoodFilter');
const casualDiningFilter = require('./filters/casualDiningFilter');
const fineDiningFilter = require('./filters/fineDiningFilter');

exports.handler = async function(event, context) {
    const { lat, lon, type } = event.queryStringParameters;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=restaurant&key=${apiKey}`;

    try {
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

        const filteredData = filterByType(allResults, type, lat, lon);
        return {
            statusCode: 200,
            body: JSON.stringify({ results: filteredData }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data', details: error.message }),
        };
    }
};

function filterByType(results, type, lat, lon) {
    let filteredResults;
    switch (type) {
        case "0":
            filteredResults = results.filter(fastFoodFilter);
            break;
        case "1":
            filteredResults = results.filter(casualDiningFilter);
            break;
        case "2":
            filteredResults = results.filter(fineDiningFilter);
            break;
        default:
            filteredResults = results;
    }

    // Ensure fast food options are ordered by distance
    if (type === "0") {
        filteredResults.sort((a, b) => 
            calculateDistance(lat, lon, a.geometry.location.lat, a.geometry.location.lng) -
            calculateDistance(lat, lon, b.geometry.location.lat, b.geometry.location.lng)
        );
    }

    const uniqueRestaurants = {};
    const chainCounts = {};
    filteredResults.forEach(restaurant => {
        const name = restaurant.name.toLowerCase();
        if (!uniqueRestaurants[name] || calculateDistance(lat, lon, restaurant.geometry.location.lat, restaurant.geometry.location.lng) <
            calculateDistance(lat, lon, uniqueRestaurants[name].geometry.location.lat, uniqueRestaurants[name].geometry.location.lng)) {
            uniqueRestaurants[name] = restaurant;
            chainCounts[name] = (chainCounts[name] || 0) + 1;
        }
    });

    return Object.values(uniqueRestaurants).map(restaurant => {
        restaurant.chainCount = chainCounts[restaurant.name.toLowerCase()];
        return restaurant;
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;

    return R * 2 * Math.asin(Math.sqrt(a));
}
