import React from 'react';
import Film from './Film'

const FilmList = (props) => {
  const { films } = props;
  if (!films || films.length === 0) return <p>No films, sorry</p>;
  return (
    <ul>
      {films.listFilm.map((film, index) => {
        return (
          <Film number={index+1} title={film.title}></Film>
        );
      })}
    </ul>
  );
};
export default FilmList;