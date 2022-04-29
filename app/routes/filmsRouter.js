import express from 'express'
import { findAllFilms, findByShowId, getBetterFilms} from '../controllers/filmsCtrl.js';

var router = new express.Router()

router.get('/', findAllFilms);
router.get('/better', getBetterFilms);
router.get('/:show_id', findByShowId);

export default router;