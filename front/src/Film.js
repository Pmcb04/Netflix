import './Film.css';

function Film(props) {
  return (
    <div className="Film">

      <div className="cover">
        <div className="number">
          <text>{props.number}</text>
        </div>
      </div>      

      <div className="title">
        <text>{props.title}</text>
      </div>
      

    </div>
  );
}

export default Film;
