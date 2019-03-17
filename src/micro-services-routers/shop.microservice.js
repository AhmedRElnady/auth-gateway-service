const config = require('config');
const shopURL = config.get('MS.shop.url');

const express = require('express');
const router = express.Router();
const apiAdapter = require('../config/api-adapter/api-adapter');
const authenticate = require('../api/middlewares/authenticate.middleware');

const shopApi = apiAdapter(shopURL);


// todo: use a messaging topology instead

router.get('/shops', authenticate(), (req, res) => {
    shopApi.get(req.path, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(shopRes => {
            res.status(shopRes.status).json({msg: shopRes.data});
        })
        .catch(err => {
        })
});

router.post('/shops', authenticate(), (req, res) => {
    shopApi.post(req.path, req.body, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(shopRes => {
            res.status(shopRes.status).send(shopRes.data)
        })
});

router.get('/shops/:id', authenticate(), (req, res) => {
    shopApi.get(req.path, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(shopRes => {
            res.status(shopRes.status).json({ data: shopRes.data });
        })
});

router.patch('/shops/:id', authenticate(), (req, res) => {
    shopApi.patch(req.path, req.body, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(shopRes => {
            res.status(shopRes.status).json({ data: shopRes.data });
        })
});

router.delete('/shops/:id', authenticate(), (req, res) => {
    shopApi.delete(req.path, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(shopRes => {
            res.status(shopRes.status).json({ data: shopRes.data });
        })
})

router.post('/shops/:id/subscribe', authenticate(), (req, res) => {
    shopApi.post(req.path, {}, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(shopRes => {
            res.status(shopRes.status).json({ data: shopRes.data });
        })
})

router.delete('/shops/:id/subscribe', authenticate(), (req, res) => {
    shopApi.delete(req.path, { headers: { "x-payload-header": JSON.stringify(req.tokenPayload) } })
        .then(shopRes => {
            res.status(shopRes.status).json({ data: shopRes.data });
        })
});


module.exports = router;
