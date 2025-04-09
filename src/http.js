import axios from "axios";

export async function fetchAvailablePlaces() {
  const response = await axios.get("http://localhost:3000/places");

  return response.data.places;
}
