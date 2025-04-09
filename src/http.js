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
    // Optionally, you can log the response or return it
    console.log("User places updated:", response.data.message);
    return response; // Or just return true/void if you don't need the response
  } catch (error) {
    console.error("Error updating user places:", error);
    // You might want to re-throw the error or return a specific error value
    throw error;
    // OR return false;
  }
}
