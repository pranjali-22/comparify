export const searchLocations = async (query: string) => {
    const response = await fetch(
        `http://localhost:3000/api/locations?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch locations");
    }

    return response.json();
};