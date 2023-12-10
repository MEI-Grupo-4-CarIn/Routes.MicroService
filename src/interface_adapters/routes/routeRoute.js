const express = require('express');
const RouteController = require('../controllers/routeController');

const router = express.Router();
const routeController = new RouteController();

router.post('/routes/create', (req, res) => routeController.createRoute(req, res));
router.patch('/routes/update/:id', (req, res) => routeController.updateRoute(req, res));
router.get('/routes/:id', (req, res) => routeController.getById(req, res));
router.get('/routes', (req, res) => routeController.getAllRoutes(req, res));
router.delete('/routes/delete/:id', (req, res) => routeController.deleteRoute(req, res));

module.exports = router;