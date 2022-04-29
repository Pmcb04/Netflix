import Film from '../models/film.js'

//GET - Return all films in the DB
export function findAllFilms (req, res) {
  Film.find().cache()
    .then((listFilms) => {
      res.status(200).json({ listFilms })
    })
    .catch( err => {
      res.status(500).json({ err })
    });
};

//GET - Return a Film with specified show_id
export function findByShowId (req, res) {
  Film.find({show_id : req.params.show_id}, { title: 1, show_id: 1, type: 1, _id:0 }).cache()
  .then((film) => {
    res.status(200).json({ film })
  })
  .catch( err => {
    res.status(500).json({ err })
  });
};


//GET - Return a list of the best films in the memory
export function getBetterFilms (req, res) {
  Film.find({show_id : req.params.show_id}, { title: 1, show_id: 1, type: 1, _id:0 }).cache()
  .then((film) => {
    res.status(200).json({ film })
  })
  .catch( err => {
    res.status(500).json({ err })
  });
};
