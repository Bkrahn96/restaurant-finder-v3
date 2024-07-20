module.exports = function casualDiningFilter(place) {
    const keywords = ['cafe', 'restaurant', 'diner', 'bistro', 'eatery'];
    return place.types.some(type => keywords.includes(type));
};
