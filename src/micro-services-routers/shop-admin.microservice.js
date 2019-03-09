const config = require('config');
const shopURL = config.get('MS.shop_admin.url');

const express = require('express');
const router = express.Router();
const apiAdapter = require('../config/api-adapter/api-adapter');
const authenticate = require('../api/middlewares/authenticate.middleware');

const shopAdminApi = apiAdapter(shopURL);



router.post('/shop-admins/:id/approve', authenticate(), (req, res)=> {
    shopAdminApi.post(req.path)
        .then(shopAdminRes => {
            res.status(shopAdminRes.status).json({ data: shopAdminRes.data });
            
        })
});

router.delete('/shop-admins/:id/approve', authenticate(), (req, res)=> {
    shopAdminApi.delete(req.path)
        .then(shopAdminRes => {
            res.status(shopAdminRes.status).json({ data: shopAdminRes.data });
            
        })
});

router.patch('/shop-admins/:id/assign-shop', authenticate(), (req, res)=> {
    shopAdminApi.patch(req.path, req.body)
        .then(shopAdminRes => {
            res.status(shopAdminRes.status).json({ data: shopAdminRes.data });
            
        })
});

router.patch('/shop-admins/:id/roles', authenticate(), (req, res)=> {
    shopAdminApi.patch(req.path, req.body)
        .then(shopAdminRes => {
            res.status(shopAdminRes.status).json({ data: shopAdminRes.data });
            
        })
});



module.exports = router;
