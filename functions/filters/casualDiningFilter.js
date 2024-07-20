// functions/filters/casualDiningFilter.js
const casualDiningKeywords = [
    "grill", "bistro", "cafe", "diner", "pub", "tavern", 
    "brunch", "eatery", "family style", "pizzeria", "bar & grill", 
    "ale house", "sports bar", "gastropub", "bar"
];

function casualDiningFilter(restaurant) {
    return (
        casualDiningKeywords.some(keyword => restaurant.name.toLowerCase().includes(keyword)) ||
        restaurant.types.includes("restaurant")
    );
}

module.exports = casualDiningFilter;
