// functions/filters/fineDiningFilter.js
const fineDiningKeywords = [
    "steakhouse", "gourmet", "fine dining", "seafood", "sushi", 
    "wine bar", "chef's table", "fusion", "tapas", "brasserie", 
    "upscale", "luxury dining"
];

const fastFoodKeywords = [
    "burger", "chicken", "sandwich", "fries", "taco", "pizza", 
    "sub", "hot dog", "ice cream", "milkshake", "smoothie", 
    "fast food", "dairy queen", "wendy's", "mcdonald's", 
    "kfc", "taco bell", "subway", "pizza hut", "domino's"
];

function fineDiningFilter(restaurant) {
    return (
        fineDiningKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
        !fastFoodKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
        !restaurant.types.includes("fast_food") &&
        !restaurant.types.includes("meal_takeaway")
    );
}

module.exports = fineDiningFilter;
