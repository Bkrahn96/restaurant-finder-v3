module.exports = function fastFoodFilter(place) {
    const keywords = ['fast food', 'burger', 'sandwich', 'taco', 'pizza', 'subs', 'fried chicken', 'dairy queen'];
    return place.types.some(type => keywords.includes(type));
};
