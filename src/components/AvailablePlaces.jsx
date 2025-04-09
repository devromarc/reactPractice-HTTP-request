import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import axios from "axios";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setavailablePlaces] = useState([]);

  useEffect(() => {
    async function getPlaces() {
      try {
        const response = await axios.get("http://localhost:3000/places");
        return response.data.places;
      } catch (error) {
        console.error("Error fetching user:", error);
        return [];
      }
    }

    (async () => {
      // Immediately invoked async function expression (IIFE)
      const places = await getPlaces();
      setavailablePlaces(places);
    })();
  }, []);
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={availablePlaces}
    />
  );
}
