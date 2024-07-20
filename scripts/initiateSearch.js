import fetchRestaurants from '../functions/fetchRestaurants.js';
import updateResultsCount from '../functions/updateResultsCount.js';
import handleGeolocationError from '../functions/handleGeolocationError.js';
import displayNextResults from './displayNextResults.js';

export default function initiateSearch() {
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
                    updateResultsCount(currentIndex, currentResults);
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
