import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieDetail from "../components/MovieDetail";
import BackHome from "../components/BackHome";
import styles from "../styling/Movie.module.css";
import Lottie from "lottie-react";
import loading from "../assets/film.json";
import DataNotFound from "../components/DataNotFound";

const Access_Token = import.meta.env.VITE_OPENDB_TOKEN;

const Base_URL = "https://api.themoviedb.org/3/movie/";

const Movie = () => {
  const { movieID } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setMovie(null);
    setError("");
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${Access_Token}`,
      },
    };
    fetch(`${Base_URL}${movieID}?language=en-US`, options)
      .then(res => {
        if (!res.ok) {
          throw new Error("Movie is not found");
        }
        return res.json();
      })
      .then(res => {
        setMovie(res);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [movieID]);

  return (
    <article className={styles.moviePage}>
      <div className={styles.backNav}>
        <BackHome />
      </div>
      {isLoading ? (
        <div className={styles.loading}>
          <Lottie
            className="loading-animation"
            animationData={loading}
            loop={true}
          />
          <p className={styles.loadingText}>Loading...</p>
        </div>
      ) : movie ? (
        <MovieDetail
          bgImage={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          rate={movie.vote_average}
          name={movie.title}
          descr={movie.overview}
          poster={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
        />
      ) : (
        error && <DataNotFound error={error} color="black" />
      )}
    </article>
  );
};

export default Movie;
