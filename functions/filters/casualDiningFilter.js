// functions/filters/casualDiningFilter.js
const casualDiningKeywords = [
    "grill", "bistro", "cafe", "diner", "pub", "tavern", 
    "brunch", "eatery", "family style", "pizzeria", "bar & grill", 
    "ale house", "sports bar", "gastropub", "bar"
];

const fastFoodKeywords = [
    "burger", "chicken", "sandwich", "fries", "taco", "pizza", 
    "sub", "hot dog", "ice cream", "milkshake", "smoothie", 
    "fast food", "dairy queen", "wendy's", "mcdonald's", 
    "kfc", "taco bell", "subway", "pizza hut", "domino's"
];

function casualDiningFilter(restaurant) {
    return (
        casualDiningKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
        !fastFoodKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) &&
        !restaurant.types.includes("fast_food") &&
        !restaurant.types.includes("meal_takeaway")
    );
}

module.exports = casualDiningFilter;
