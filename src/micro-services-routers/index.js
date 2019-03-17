const express = require('express');
const router = express.Router();
const shopRoutes = require('./shop.microservice');
const shopAdminRoutes = require('./shop-admin.microservice');
const customerRoutes = require('./customer.microservice');

router.use((req, res, next) => {
    console.log(`##### calling: "${req.path}" path ... ####`);
    next();
})

router.use(shopRoutes);
router.use(shopAdminRoutes);
router.use(customerRoutes);


module.exports = router;