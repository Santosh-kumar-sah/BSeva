const express = require('express');
const router = express.Router();
const controller = require('./careers.controller');
const { optionalAuth } = require('../../middleware/auth');

router.get('/', controller.getCareers);
router.post('/recommend', optionalAuth, controller.recommend);
router.get('/:slug', controller.getCareerBySlug);

module.exports = router;
