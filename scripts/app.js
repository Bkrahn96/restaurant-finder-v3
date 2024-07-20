import initiateSearch from './initiateSearch.js';
import loadMoreResults from './loadMoreResults.js';
import displayNextResults from './displayNextResults.js';

let currentResults = [];
let currentIndex = 0;
let userCoordinates = null;
const RESULTS_PER_PAGE = 3;
let maxDistance = 1;

document.getElementById('findRestaurant').onclick = function() {
    initiateSearch();
};

document.getElementById('loadMore').onclick = function() {
    loadMoreResults();
};

document.getElementById('restaurantTypeSlider').oninput = function() {
    initiateSearch();
};

document.getElementById('distanceSlider').oninput = function() {
    const distanceValue = document.getElementById('distanceValue');
    const newMaxDistance = this.value;
    distanceValue.textContent = `${newMaxDistance} Mile${newMaxDistance > 1 ? 's' : ''}`;

    if (newMaxDistance < maxDistance) {
        maxDistance = newMaxDistance;
        currentResults = currentResults.filter(restaurant => calculateDistance(
            userCoordinates.lat,
            userCoordinates.lon,
            restaurant.geometry.location.lat,
            restaurant.geometry.location.lng
        ) <= maxDistance);
        document.getElementById('results').innerHTML = '';
        currentIndex = 0;
        displayNextResults();
        updateResultsCount();
    } else {
        maxDistance = newMaxDistance;
        document.getElementById('loadMore').style.display = 'block';
    }
};

// Set default slider values based on current time
window.onload = function() {
    const mealTimeSlider = document.getElementById('mealTimeSlider');
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 11) {
        mealTimeSlider.value = 0; // Breakfast
    } else if (currentHour >= 11 && currentHour < 17) {
        mealTimeSlider.value = 1; // Lunch
    } else if (currentHour >= 17 && currentHour < 22) {
        mealTimeSlider.value = 2; // Dinner
    } else {
        mealTimeSlider.value = 1; // Default to Lunch
    }
    document.getElementById('distanceSlider').value = 1;
    document.getElementById('distanceValue').textContent = '1 Mile';
};
