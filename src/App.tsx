import { useState } from "react";
import "./App.css";
import css from "../src/styles/App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import axios from "axios";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import MovieModal from "./components/MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export interface Movie {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

//  ?TMDB использует ключ 'results'
interface MoviesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Новый тип данных для результата useQuery
interface MovieData {
  movies: Movie[];
  totalPages: number;
}

function App() {
  // const [articles, setArticles] = useState<Movie[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isError, setIsError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [topic, setTopic] = useState<string>(""); //!1 запрос
  const [currentPage, setCurrentPage] = useState(1); //* пагинация

  const initialMovieData: MovieData = {
    movies: [],
    totalPages: 0,
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelect = (id: number) => {
    // const movie = articles.find((item) => item.id === id);
    const movie = data.find((item) => item.id === id);
    if (movie) {
      setSelectedMovie(movie); //   Зберігаємо об'єкт Movie
      openModal();
    }
  };

  // const handleSearch = async (topic: string) => {
  //   if (!topic.trim()) {
  //     setArticles([]);
  //     return;
  //   }
  //   // ?const myKey = import.meta.env.VITE_TMDB_TOKEN_V3;
  //   const config = {
  //     params: {
  //       // ?api_key: myKey,
  //       query: topic,
  //     },
  //     headers: {
  //       accept: "application/json",
  //       Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  //     },
  //   };
  //   try {
  //     setIsLoading(true);
  //     setIsError(false);
  //     const response = await axios.get<MoviesHttpResponse>(
  //       `https://api.themoviedb.org/3/search/movie`,
  //       config
  //     );
  //     // ?const results = response.data.results;
  //     if (response.data.results.length === 0) {
  //       toast.error("No movies found for your request.");
  //     }
  //     setArticles(response.data.results);
  //   } catch (error) {
  //     setIsError(true);
  //     setArticles([]); //  ?Очистка списка фильмов при ошибке
  //     toast.error("No movies found for your request.");
  //     console.error("No movies found for request.", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // !
  const {
    // Возьми из результата React Query поле data, назови его articles, и если его пока нет — дай ему пустой массив»
    // data: articles = []
    data: movieData = initialMovieData,
    isLoading,
    isError,
  } = useQuery<MovieData>({
    queryKey: ["movies", topic, currentPage],
    queryFn: () => fetchMovies(topic, currentPage),
    enabled: topic !== "",
    placeholderData: keepPreviousData,
  });
  // console.log(data);
  const data: Movie[] = movieData.movies;
  const totalPages: number = movieData.totalPages;

  // !
  const fetchMovies = async (
    topic: string,
    page: number
  ): Promise<MovieData> => {
    const config = {
      params: { query: topic, page: page },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    };

    const response = await axios.get<MoviesHttpResponse>(
      "https://api.themoviedb.org/3/search/movie",
      config
    );

    if (response.data.results.length === 0 && topic.trim() !== "") {
      toast.error(`No movies found for the query: "${topic}".`);
    }

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages,
    };
  };

  // ?синтаксис .then().catch() вместо блока try...catch
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
      {/* <SearchBar onSearch={handleSearch} /> */}
      {/* //!2 */}
      <SearchBar onSearch={setTopic} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data.length > 0 && <MovieGrid movies={data} onSelect={handleSelect} />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}

export default App;
