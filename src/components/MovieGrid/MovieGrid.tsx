import css from "./MovieGrid.module.css";
import type { Movie } from "../../App";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "../../../public/film-roll.jpg";
interface MovieGridProps {
  movies: Movie[]; // ✅ Указываем, что это массив объектов Movie
  onSelect: (id: number) => void; // ✅ Указываем тип функции
}

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  return (
    <ul className={css.grid}>
      {movies.map(({ id, poster_path, title }) => (
        <li key={id} className="movie-item" onClick={() => onSelect(id)}>
          <div className={css.card}>
            <img
              className={css.image}
              src={
                poster_path
                  ? `${TMDB_IMAGE_BASE_URL}${poster_path}`
                  : PLACEHOLDER
              }
              alt={title}
              loading="lazy"
            />
            <h2 className={css.title}>{title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
