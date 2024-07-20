// functions/filters/fastFoodFilter.js
const fastFoodKeywords = ["burger", "chicken", "sandwich", "fries", "fast food", "smoothie"];

function fastFoodFilter(restaurant) {
    const excludeTypes = ["bar", "home_goods_store"];
    const chainNames = ["mcdonald's", "burger king", "wendy's", "dairy queen"];

    return (
        fastFoodKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
        !excludeTypes.some(excludeType => restaurant.types.includes(excludeType)) &&
        !chainNames.some(chain => restaurant.name.toLowerCase().includes(chain)) &&
        (restaurant.types.includes("bakery") ? restaurant.types.includes("cafe") : true)
    );
}

module.exports = fastFoodFilter;
