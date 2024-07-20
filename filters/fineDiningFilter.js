module.exports = function fineDiningFilter(place) {
    const keywords = ['restaurant', 'steakhouse', 'seafood', 'french', 'italian', 'japanese', 'wine bar'];
    return place.types.some(type => keywords.includes(type));
};
