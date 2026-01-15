const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');

// GET /preferences
router.get('/', preferencesController.getPreferences);

// PUT /preferences
router.put('/', preferencesController.updatePreferences);

module.exports = router;