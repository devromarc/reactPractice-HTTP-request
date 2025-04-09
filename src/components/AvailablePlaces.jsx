import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  // state of the loading state
  const [isFetching, setisFetching] = useState(false);
  const [availablePlaces, setavailablePlaces] = useState([]);
  const [error, seterror] = useState();

  useEffect(() => {
    async function getPlaces() {
      setisFetching(true);
      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setavailablePlaces(sortedPlaces);
          setisFetching(false);
        });

        // first option - returning the result
        // return response.data.places
      } catch (error) {
        seterror({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
        setisFetching(false);
      }
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
      onSelectPlace={onSelectPlace}
    />
  );
}
