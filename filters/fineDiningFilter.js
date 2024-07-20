// filters/fineDiningFilter.js
function fineDiningFilter(restaurant) {
    const types = ["restaurant"];
    return types.some(type => restaurant.types.includes(type));
}

module.exports = fineDiningFilter;
