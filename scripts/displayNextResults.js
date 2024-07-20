import calculateDistance from '../functions/calculateDistance.js';
import updateResultsCount from '../functions/updateResultsCount.js';

export default function displayNextResults() {
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
    updateResultsCount(currentIndex, currentResults);
}
