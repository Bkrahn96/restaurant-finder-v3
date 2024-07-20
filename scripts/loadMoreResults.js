import fetchRestaurants from '../functions/fetchRestaurants.js';
import updateResultsCount from '../functions/updateResultsCount.js';
import displayNextResults from './displayNextResults.js';

export default function loadMoreResults() {
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
