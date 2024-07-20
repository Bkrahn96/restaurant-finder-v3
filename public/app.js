// public/app.js
import calculateDistance from '../functions/calculateDistance.js';
import handleGeolocationError from '../functions/handleGeolocationError.js';
import fetchRestaurants from '../functions/fetchRestaurants.js';

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

function initiateSearch() {
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');
    const loadMoreButton = document.getElementById('loadMore');
    const resultsFooter = document.querySelector('.results-footer');

    resultsFooter.style.display = 'none';
    loadMoreButton.disabled = true;
    if (navigator.geolocation) {
        loading.style.display = 'block';
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            userCoordinates = { lat, lon };
            const restaurantType = document.getElementById('restaurantTypeSlider').value;
            fetchRestaurants(lat, lon, restaurantType, maxDistance)
                .then(data => {
                    currentResults = data.results || [];
                    currentIndex = 0;
                    results.innerHTML = '';
                    loading.style.display = 'none';
                    updateResultsCount();
                    loadMoreButton.style.display = currentResults.length > RESULTS_PER_PAGE ? 'block' : 'none';
                    loadMoreButton.disabled = currentResults.length <= RESULTS_PER_PAGE;
                    resultsFooter.style.display = 'flex';
                    displayNextResults();
                })
                .catch(error => {
                    results.innerHTML = '<p>Failed to fetch restaurant data. Please try again later.</p>';
                    loading.style.display = 'none';
                });
        }, function(error) {
            loading.style.display = 'none';
            handleGeolocationError(error);
        });
    } else {
        results.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

function displayNextResults() {
    const results = document.getElementById('results');
    const loadMoreButton = document.getElementById('loadMore');
    const nextResults = currentResults.slice(currentIndex, currentIndex + RESULTS_PER_PAGE);

    nextResults.forEach(restaurant => {
        const div = document.createElement('div');
        const distance = calculateDistance(
            userCoordinates.lat, 
            userCoordinates.lon, 
            restaurant.geometry.location.lat, 
            restaurant.geometry.location.lng
        );
        const types = restaurant.types ? restaurant.types.join(', ') : 'N/A';
        const chainNote = restaurant.chainCount > 1 ? '<p>Note: This is the closest location, but there are multiple locations nearby not shown in the search results.</p>' : '';
        div.innerHTML = `
            <h2>${restaurant.name}</h2>
            <p>Address: ${restaurant.vicinity}</p>
            <p>Type: ${types}</p>
            <p>Distance: ${distance.toFixed(2)} miles</p>
            <p>Rating: ${restaurant.rating || 'N/A'}</p>
            ${chainNote}
        `;
        results.appendChild(div);
    });

    currentIndex += RESULTS_PER_PAGE;
    loadMoreButton.disabled = currentIndex >= currentResults.length;
    updateResultsCount();
}

function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = `Showing ${Math.min(currentIndex, currentResults.length)}/${currentResults.length} results`;
}

function loadMoreResults() {
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = 'Loading...';

    const results = document.getElementById('results');
    const loadMoreButton = document.getElementById('loadMore');
    const restaurantType = document.getElementById('restaurantTypeSlider').value;

    fetchRestaurants(userCoordinates.lat, userCoordinates.lon, restaurantType, maxDistance)
        .then(data => {
            const newResults = data.results || [];
            const uniqueNewResults = newResults.filter(newResult => 
                !currentResults.some(currentResult => 
                    currentResult.place_id === newResult.place_id));
            currentResults = currentResults.concat(uniqueNewResults);
            displayNextResults();
            loadMoreButton.disabled = currentIndex >= currentResults.length;
            resultsCount.textContent = `Showing ${Math.min(currentIndex, currentResults.length)}/${currentResults.length} results`;
        })
        .catch(error => {
            results.innerHTML = '<p>Failed to fetch restaurant data. Please try again later.</p>';
            loadMoreButton.style.display = 'none';
        });
}

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
