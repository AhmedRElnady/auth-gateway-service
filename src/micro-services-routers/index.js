const express = require('express');
const router = express.Router();
const shopRoutes = require('./shop.microservice');
const shopAdminRoutes = require('./shop-admin.microservice');


router.use((req, res, next) => {
    console.log(`##### calling: "${req.path}" path ... ####`);
    next();
})

router.use(shopRoutes);
router.use(shopAdminRoutes);


module.exports = router;