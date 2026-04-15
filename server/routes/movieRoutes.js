// server/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getAllMovies);
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);

module.exports = router;