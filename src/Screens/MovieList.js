import React, { useState, useEffect } from "react";
import { getMovies } from "../api";

let prev = [];

export default () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const onScroll = () => {
    if (
      Math.floor(document.documentElement.getBoundingClientRect().bottom) <=
      window.innerHeight
    ) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    getMovies(page)
      .then(
        ({
          data: {
            data: { movies },
          },
        }) => {
          setData([...prev, ...movies]);
          prev = [...prev, ...movies];
        }
      )
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [page]);

  return (
    <>
      <h1>Infinite Movies / Page {page}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        data.map((movie, index) => (
          <div
            key={movie.id}
            style={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            {index + 1} {movie.title}
          </div>
        ))
      )}
    </>
  );
};
