const express = require('express');
const router = express.Router();
const controller = require('./schemes.controller');

router.get('/', controller.getSchemes);
router.get('/categories', controller.getCategories);
router.get('/departments', controller.getDepartments);
router.get('/:slug', controller.getSchemeBySlug);

module.exports = router;
