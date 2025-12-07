import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import axios from "axios";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import MovieModal from "./components/MovieModal/MovieModal";

export interface Movie {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

//  TMDB использует ключ 'results'
// TMDB также включает поля 'page', 'total_pages', 'total_results'
interface MoviesHttpResponse {
  results: Movie[];
}

function App() {
  const [articles, setArticles] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelect = (id: number) => {
    const movie = articles.find((item) => item.id === id);
    // console.log(movie);

    if (movie) {
      setSelectedMovie(movie); //   Зберігаємо об'єкт Movie
      openModal();
    }
  };

  const handleSearch = async (topic: string) => {
    if (!topic.trim()) {
      setArticles([]);

      return;
    }

    // const myKey = import.meta.env.VITE_TMDB_TOKEN_V3;
    const config = {
      params: {
        // api_key: myKey,
        query: topic,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    };

    try {
      setIsLoading(true);
      setIsError(false);

      const response = await axios.get<MoviesHttpResponse>(
        `https://api.themoviedb.org/3/search/movie`,
        config
      );
      // const results = response.data.results;
      if (response.data.results.length === 0) {
        toast.error("No movies found for your request.");
      }
      setArticles(response.data.results);
    } catch (error) {
      setIsError(true);
      setArticles([]); //  Очистка списка фильмов при ошибке
      toast.error("No movies found for your request.");
      console.error("No movies found for request.", error);
    } finally {
      setIsLoading(false);
    }
  };
  // синтаксис .then().catch() вместо блока try...catch
  // axios
  //   .get<MoviesHttpResponse>(
  //     `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${topic}`
  //   )
  //   .then((response) => {
  //     setArticles(response.data.results);
  //   })
  //   .catch((error) => {
  //     console.error("Ошибка при выполнении поиска TMDB:", error);
  //   });
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSearch={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {articles.length > 0 && (
        <MovieGrid movies={articles} onSelect={handleSelect} />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}

export default App;
