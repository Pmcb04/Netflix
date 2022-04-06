import Film from '../models/film.js'

//GET - Return all films in the DB
export function findAllFilms (req, res) {
  Film.find()
    .then((listFilms) => {
      res.status(200).json({ films: listFilms })
    })
    .catch( err => {
      res.status(500).json({ error : err })
    });
};

//GET - Return a Film with specified show_id
export function findByShowId (req, res) {
  Film.find({show_id : req.params.show_id})
  .then((listFilms) => {
    console.log("GET /films method findAllFilms");
    res.status(200).json({ films: listFilms })
  })
  .catch( err => {
    res.status(500).json({ error : err })
  });
};
