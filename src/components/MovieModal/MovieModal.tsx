import { useEffect } from "react";
import type { Movie } from "../../App";
import css from "./MovieModal.module.css";
import { createPortal } from "react-dom";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const PLACEHOLDER = "../../../public/film-roll.jpg";

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };
    document.body.style.overflow = "hidden"; //Заборона прокрутки фону
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = ""; //Заборона прокрутки фону -
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return createPortal(
    <div
      onClick={handleBackDropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Close modal"
        >
          &times;
        </button>
        <img
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : PLACEHOLDER
          }
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average / 10}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
