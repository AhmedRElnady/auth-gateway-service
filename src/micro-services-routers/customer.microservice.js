const config = require('config');
const customerURL = config.get('MS.customer.url');

const express = require('express');
const router = express.Router();
const apiAdapter = require('../config/api-adapter/api-adapter');
const authenticate = require('../api/middlewares/authenticate.middleware');

const customerApi = apiAdapter(customerURL);


router.get('/customers/', authenticate(), (req, res) => {
    customerApi.get(req.path, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(customerRes => {
            res.status(customerRes.status).json({ data: customerRes.data});
        })
});


module.exports = router;
