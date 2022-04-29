import './Film.css';

function Film(props) {
  return (
    <div className="Film">

      <div className="cover">
        <div className="number">
          {props.number}
        </div>
      </div>      

      <div className="title">
        {props.title}
      </div>
    
    </div>
  );
}

export default Film;
