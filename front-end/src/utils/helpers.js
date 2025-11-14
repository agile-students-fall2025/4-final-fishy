// General front-end utility helpers used across TripMate

/** Create a reasonably unique id with an optional prefix. */
export function makeId(prefix = "id") {
	const rand = Math.random().toString(36).slice(2, 8);
	return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

/**
 * Format a YYYY-MM-DD (or ISO) date into a friendly string like "Mar 12, 2025".
 * Returns an empty string if the input is falsy or invalid.
 */
export function formatPrettyDate(input) {
	if (!input) return "";
	try {
		const date = new Date(input);
		if (isNaN(date.getTime())) return "";
		return date.toLocaleDateString(undefined, {
			month: 'short', day: '2-digit', year: 'numeric'
		});
	} catch {
		return "";
	}
}


export function pluralize(word, n) {
	return n === 1 ? word : `${word}s`;
}

/**
 * Get an Unsplash image URL for a destination.
 * This is now an async function that searches Unsplash API for destination-specific images.
 * 
 * NOTE: This function is deprecated in favor of using searchUnsplashPhoto from api.js
 * which provides better results by searching Unsplash API directly.
 * 
 * @param {string} destination - The destination string (e.g., "Tokyo, Japan" or "Paris")
 * @param {number} width - Image width (default: 800)
 * @param {number} height - Image height (default: 600)
 * @returns {string} Unsplash image URL (fallback image if API key not available)
 */
export function getDestinationImageUrl(destination, width = 800, height = 600) {
	// This is now a fallback function that returns a placeholder
	// The actual image fetching should be done using searchUnsplashPhoto from api.js
	// in the component using React hooks (useState/useEffect)
	
	if (!destination) {
		return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
	}
	
	// Return a placeholder that indicates image is loading
	// The actual fetching should happen in the component
	return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
}
