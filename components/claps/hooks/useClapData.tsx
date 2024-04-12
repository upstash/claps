import { useState, useEffect } from "react";

const useClapData = (apiPath: string) => {
  const [data, setData] = useState({
    totalScore: 0,
    userScore: 0,
    totalUsers: 0,
    maxClaps: 0,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(apiPath, { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setReady(true);
      }
    };

    getData();
  }, [apiPath]);

  return { data, setData, ready };
};

export default useClapData;
