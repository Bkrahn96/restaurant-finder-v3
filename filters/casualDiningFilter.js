// filters/casualDiningFilter.js
function casualDiningFilter(restaurant) {
    const types = ["restaurant"];
    return types.some(type => restaurant.types.includes(type));
}

module.exports = casualDiningFilter;
