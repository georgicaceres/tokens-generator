var express = require('express');
var router = express.Router();
const tokenController = require('../controllers/tokenController');

/*  */
router.get('/:token', tokenController.validateToken);

module.exports = router;
