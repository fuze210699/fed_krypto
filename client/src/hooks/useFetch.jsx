import { useEffect, useState } from "react";

const API_KEY = "DJFc1i91c0f19YxxAdlvekQj5HIHezVj";
const useFetch = ({ keyword }) => {
  const [gifURL, setGifURL] = useState("");

  const fetchGif = async () => {
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword
          .split(" ")
          .join("")}&limit=1`
      );
      const data = await res.json();
      // console.log(data.data[0]?.images?.downsized_medium?.url);
      setGifURL(data.data[0]?.images?.downsized_medium?.url);
    } catch (error) {
      setGifURL(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };
  useEffect(() => {
    if (keyword) fetchGif();
  }, [keyword]);
  return gifURL;
};
export default useFetch;
