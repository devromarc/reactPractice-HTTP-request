import { useRef, useState, useCallback, useEffect } from "react";
import ErrorPage from "./components/Error.jsx";
import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { fetchUserPlaces, updateUserPlaces } from "./http.js";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingState, seterrorUpdatingState] = useState();

  const [isFetchingUserData, setisFetchingUserData] = useState(false);
  const [errorFetchingUserData, seterrorFetchingUserData] = useState();

  useEffect(() => {
    async function getUserPlaces() {
      setisFetchingUserData(true);
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
        setisFetchingUserData(false);
      } catch (error) {
        seterrorFetchingUserData({
          message:
            error.message ||
            "Could not fetch the user places, please try again.",
        });
      }
      setisFetchingUserData(false);
    }

    getUserPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    // optimistic update
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      seterrorUpdatingState({
        message: error.message || "Failed to update the place",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      // optimistic update
      try {
        await updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        seterrorUpdatingState({
          message: error.message || "Failed to delete place.",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  function handleError() {
    seterrorUpdatingState(null);
  }

  return (
    <>
      <Modal open={errorUpdatingState} onClose={handleError}>
        {errorUpdatingState && (
          <ErrorPage
            title="An error occurred!"
            message={errorUpdatingState.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {errorFetchingUserData && (
          <ErrorPage
            title="an error occured"
            message={errorFetchingUserData.message}
          />
        )}
        {!errorFetchingUserData && (
          <Places
            isLoading={isFetchingUserData}
            loadingText="Fetching your Places"
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
