const fetch = require('node-fetch');

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
        const sortedData = sortByDistance(filteredData, lat, lon);
        return {
            statusCode: 200,
            body: JSON.stringify({ results: sortedData }),
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
    const typesMap = {
        "0": ["meal_takeaway", "fast_food", "cafe"],  // Fast Food, Cafe
        "1": ["restaurant"],                         // Casual Dining
        "2": ["restaurant"]                          // Fine Dining (not an explicit type in Places API)
    };

    const excludeTypes = ["bar", "home_goods_store"];
    const fastFoodKeywords = [
        "burger", "chicken", "sandwich", "fries", "fast food", "wendy's", "dairy queen", "smoothie"
    ];
    const casualDiningExcludeKeywords = [
        "home cooking", "dunkin", "starbucks"
    ];
    const casualDiningIncludeKeywords = [
        "home style", "sandwich", "soup"
    ];

    const typeKeywords = typesMap[type];

    if (!typeKeywords) {
        return results;
    }

    let filteredResults = results.filter(restaurant =>
        (typeKeywords.some(keyword => restaurant.types.includes(keyword)) ||
        (type === "0" && fastFoodKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)))) &&
        !excludeTypes.some(excludeType => restaurant.types.includes(excludeType)) &&
        (type !== "0" || (restaurant.types.includes("bakery") ? restaurant.types.includes("cafe") : true))
    );

    // Exclude fast food from casual dining results and apply additional filters
    if (type === "1") {
        filteredResults = filteredResults.filter(restaurant => 
            !fastFoodKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
            !casualDiningExcludeKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
            (!restaurant.types.includes("bakery") || restaurant.types.includes("cafe")) &&
            (!restaurant.types.includes("bakery") || casualDiningIncludeKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)))
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

function sortByDistance(results, lat, lon) {
    return results.sort((a, b) => 
        calculateDistance(lat, lon, a.geometry.location.lat, a.geometry.location.lng) -
        calculateDistance(lat, lon, b.geometry.location.lat, b.geometry.location.lng)
    );
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
