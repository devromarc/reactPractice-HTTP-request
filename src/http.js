import api from "./api";

export async function fetchAvailablePlaces() {
  try {
    const response = await api.get("/places");
    return response.data.places;
  } catch (error) {
    console.error("Error fetching the places:", error);
    throw error;
  }
}

export async function updateUserPlaces(places) {
  try {
    const response = await api.put("/user-places", { places });
    console.log("User places updated:", response.data.message);
    return response;
  } catch (error) {
    console.error("Error updating user places:", error);
    throw error;
  }
}
