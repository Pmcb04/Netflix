import express from 'express'
import { findAllFilms, findByShowId} from '../controllers/filmsCtrl.js';

var router = new express.Router()

router.get('/', findAllFilms);
router.get('/:show_id', findByShowId);

export default router;