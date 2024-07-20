// functions/filters/fineDiningFilter.js
const fineDiningKeywords = [
    "steakhouse", "gourmet", "fine dining", "seafood", "sushi", 
    "wine bar", "chef's table", "fusion", "tapas", "brasserie"
];

function fineDiningFilter(restaurant) {
    return (
        fineDiningKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) ||
        restaurant.types.includes("restaurant")
    );
}

module.exports = fineDiningFilter;
