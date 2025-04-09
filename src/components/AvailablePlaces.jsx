import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import axios from "axios";
import ErrorPage from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  // state of the loading state
  const [isFetching, setisFetching] = useState(false);
  const [availablePlaces, setavailablePlaces] = useState([]);
  const [error, seterror] = useState();

  useEffect(() => {
    async function getPlaces() {
      setisFetching(true);
      try {
        const response = await axios.get("http://localhost:3000/places");
        // second option - directly inject the result to the state
        setavailablePlaces(response.data.places);
        // first option - returning the result
        // return response.data.places
      } catch (error) {
        seterror({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
      }
      setisFetching(false);
    }

    // second option - calling the funtion.
    getPlaces();

    // first option - using IIFE so that we can have an await function call
    // (async () => {
    //   // Immediately invoked async function expression (IIFE)
    //   const places = await getPlaces();
    //   setavailablePlaces(places);
    // })();
  }, []);

  // Error handling. additional component
  if (error) {
    return <ErrorPage title="An error occurred!" message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      // handle loading state while getting the data from backend
      loadingText="Fetching place data ...."
      isLoading={isFetching}
      // /////////////////////////////////////////////////////////
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={availablePlaces}
    />
  );
}
