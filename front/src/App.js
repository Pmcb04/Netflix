import './App.css';
import Film from './Film';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const listItems = numbers.map((number) =>  <Film title="test title" number={number}></Film>);

function App() {
  return (
    <div className="App">
      {listItems}
    </div>
  );
}

export default App;
