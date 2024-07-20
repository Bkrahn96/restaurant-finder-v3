// functions/filters/fastFoodFilter.js
const fastFoodKeywords = [
    "burger", "chicken", "sandwich", "fries", "taco", "pizza", 
    "sub", "hot dog", "ice cream", "milkshake", "smoothie", 
    "fast food", "dairy queen", "wendy's", "mcdonald's", 
    "kfc", "taco bell", "subway", "pizza hut", "domino's"
];

function fastFoodFilter(restaurant) {
    const excludeTypes = ["bar", "home_goods_store"];
    return (
        (fastFoodKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) ||
        restaurant.types.includes("meal_takeaway") ||
        restaurant.types.includes("fast_food")) &&
        !excludeTypes.some(excludeType => restaurant.types.includes(excludeType)) &&
        (restaurant.types.includes("bakery") ? restaurant.types.includes("cafe") : true)
    );
}

module.exports = fastFoodFilter;
