import express from 'express'
import { findAllFilms, findByShowId} from '../controllers/filmsCtrl.js';
import { getBetterFilms } from '../utils/redis.js'

var router = new express.Router()

router.get('/', findAllFilms);
router.get('/better', getBetterFilms);
router.get('/:show_id', findByShowId);

export default router;