module.exports = function updateResultsCount(currentIndex, currentResults) {
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = `Showing ${Math.min(currentIndex, currentResults.length)}/${currentResults.length} results`;
};
