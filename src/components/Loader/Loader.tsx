import css from "./Loader.module.css";

const Loader = () => {
  return (
    <div>
      <p className={css.text}>Loading movies, please wait...</p>
    </div>
  );
};

export default Loader;
