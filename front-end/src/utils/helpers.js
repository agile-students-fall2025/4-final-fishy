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

