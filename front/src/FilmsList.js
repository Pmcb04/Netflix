import React from 'react';

var list = []

class FilmsList extends React.Component{

    componentDidMount(){
        const apiUrl = 'http://localhost:3000/api/better';
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
              for(let i in data){
                list.push(data[i])
                console.log("data", data[i])
              }
              console.log('This is your data', data)
              console.log("list ", list)
          });
    }

    render(){

        const listItems = list.map((number) =>
        <li key={number.toString()}>{number}</li>);

        return (
            <div className="FilmsList">
              <ul>{listItems}</ul>
            </div>
          );
    }


}

export default FilmsList;