import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialDataValue) {
  const [isFetching, setisFetching] = useState(false);
  const [error, seterror] = useState();
  const [fetchedData, setfetchedData] = useState(initialDataValue);

  useEffect(() => {
    async function fetchData() {
      setisFetching(true);
      try {
        const data = await fetchFn();
        setfetchedData(data);
        setisFetching(false);
      } catch (error) {
        seterror({
          message: error.message || "Failed to fetch data.",
        });
      }
      setisFetching(false);
    }

    fetchData();
  }, [fetchFn]);

  return {
    isFetching,
    error,
    fetchedData,
    setfetchedData,
  };
}
