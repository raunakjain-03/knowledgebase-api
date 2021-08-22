const express = require('express');
const {
  getKnowledges,
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
} = require('../controllers/knowledge');

// Load another model
const Knowledge = require('../models/Knowledge');

// Mount middleware to display advanced results like pagination, sorting, specific select attributes
const advancedResults = require('../middleware/advancedResults');

// Use the express.Router class to create modular, mountable route handlers
const router = express.Router();

// Mount auth middleware in order to make routes private
const { protect } = require('../middleware/auth');

// define routes
router
  .route('/')
  .get(advancedResults(Knowledge, 'users'), getKnowledges)
  .post(protect, createKnowledge);

router
  .route('/:id')
  .get(getKnowledge)
  .put(protect, updateKnowledge)
  .delete(protect, deleteKnowledge);

// Export router object
module.exports = router;
