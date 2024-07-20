const fetchRestaurants = require('./fetchRestaurants');
const fastFoodFilter = require('./filters/fastFoodFilter');
const casualDiningFilter = require('./filters/casualDiningFilter');
const fineDiningFilter = require('./filters/fineDiningFilter');
const calculateDistance = require('./calculateDistance');

exports.handler = async function(event, context) {
    const { lat, lon, type, maxDistance } = event.queryStringParameters;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    try {
        const allResults = await fetchRestaurants(lat, lon, maxDistance, apiKey);
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

    // Ensure all options are ordered by distance
    filteredResults.sort((a, b) => 
        calculateDistance(lat, lon, a.geometry.location.lat, a.geometry.location.lng) -
        calculateDistance(lat, lon, b.geometry.location.lat, b.geometry.location.lng)
    );

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
