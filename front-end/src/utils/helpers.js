// Utility functions will go here
export function formatPrettyDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  
  export function makeId(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
  }
  