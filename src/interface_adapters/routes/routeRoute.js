const express = require('express');
const RouteController = require('../controllers/routeController');

const router = express.Router();
const routeController = new RouteController();

router.post('/routes/create', (req, res) => routeController.createRoute(req, res));

module.exports = router;