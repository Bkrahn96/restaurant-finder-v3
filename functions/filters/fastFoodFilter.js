// functions/filters/fastFoodFilter.js
const fastFoodKeywords = ["burger", "chicken", "sandwich", "fries", "fast food", "wendy's", "dairy queen"];

function fastFoodFilter(restaurant) {
    const excludeTypes = ["bar", "home_goods_store"];
    return (
        fastFoodKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
        !excludeTypes.some(excludeType => restaurant.types.includes(excludeType)) &&
        (restaurant.types.includes("bakery") ? restaurant.types.includes("cafe") : true)
    );
}

module.exports = fastFoodFilter;
