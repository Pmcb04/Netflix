import React, { useEffect, useState } from 'react';
import './App.css';
import FilmList from './FilmList';
import WithListLoading from './WithListLoading';
function App() {
  const ListLoading = WithListLoading(FilmList);
  const [appState, setAppState] = useState({
    loading: false,
    films: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = `http://localhost:8080/api/films`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((films) => {
        console.log(films)
        setAppState({ loading: false, films: films });
      });
  }, [setAppState]);

  return (
    <div className='App'>

      <div className='container'>
        <h1>Best Films</h1>
      </div>

      <div className='films-container'>
        <ListLoading isLoading={appState.loading} films={appState.films} />
      </div>

    </div>
  );
}
export default App;