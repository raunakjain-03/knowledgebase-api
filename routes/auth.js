const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');

// Mount middleware to display advanced results like pagination, sorting, specific select attributes
const router = express.Router();

// Mount auth middleware in order to make routes private
const { protect } = require('../middleware/auth');

// define routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// Export router object
module.exports = router;
