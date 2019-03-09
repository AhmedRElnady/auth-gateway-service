const express = require('express');
const router = express.Router();
const apiAdapter = require('../../config/api-adapter/api-adapter');
const User = require('../../models/users.model');
const validate = require('../middlewares/validate.middleware');
const jwt = require('../../utils/jwt.util');
const bcrypt = require('../../utils/bcrypt.util');
const config = require('config');


router.post('/signup', validate(), async (req, res, next) => {
    try {
        let _apiAdapter,
            GWUserID,
            GWuserRole;

        const createdUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hashPassword(req.body.password),
            role: req.body.role
        });

        GWUserID = createdUser.id;
        GWuserRole = createdUser.role;
        const { MSURL, MSPrefix } = await _getMSURLAndPrefix(GWuserRole);  
        _apiAdapter = apiAdapter(MSURL);
        
        // todo: seperate logic in a service file
        _apiAdapter.post(`/${MSPrefix}/signup`, { GWUserID })
            .then(async serviceRes => {
                console.log("####### response form microService #####", serviceRes.data);
                
                // after user registeration in both gateway and the microservice, sign jwt
                const token = await jwt.signToken({ id: GWUserID, role: GWuserRole });

                res.status(201).json({
                    msg: `user created successfuly in both GATEWAY and ${MSPrefix} services`,  // change msg
                    data: createdUser, // delete password
                    token
                });
            });
    } catch (e) {
        next(e);
    }
});

router.post('/login', validate(), async (req, res, next) => {
    try {
        let _apiAdapter,
            GWUserID,
            GWuserRole;

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("Not registered email.");
        
        if(! await bcrypt.isValidPassword(req.body.password, user.password)) return res.status(401).send("Invalid password");

        /*
            i need to store shopId in jwt, don't save admin permissions in jwt for these reasons:
            so i need to make a request to the service to get user details (shop-admin or customer);
            
        */

       GWUserID = user.id;
       GWuserRole = user.role;
       const { MSURL, MSPrefix } = await _getMSURLAndPrefix(GWuserRole);
       _apiAdapter = apiAdapter(MSURL);


       _apiAdapter.get(`/${MSPrefix}/${GWUserID}`)
            .then(async serviceRes => {
                console.log("####### response form microService #####", serviceRes.data);
                const payload = await _setTokenPayload(GWUserID, GWuserRole, serviceRes.data)  
                const token = await jwt.signToken(payload);
                
                res.status(200).json({
                    msg: `logged in successfuly, welcome`,
                    token
                });
            });
    } catch (err) {

    }
});

const _getMSURLAndPrefix = (registeredRole) => {
    return new Promise((resolve, reject) => {
        let MSURL = config.get('MS.customer.url'),
            MSPrefix = config.get('MS.customer.prefix');

        if (registeredRole === "SHOP_ADMIN") {
            MSURL = config.get('MS.shop_admin.url'),
                MSPrefix = config.get('MS.shop_admin.prefix')
        }
        resolve({ MSURL, MSPrefix });
    });
};

const _setTokenPayload = (GWUserID, GWuserRole, userDetails) => {
    return new Promise((resolve, reject) => {
        let payload = { // for both super and customers
            id: GWUserID,
            role: GWuserRole
        };

        if (GWuserRole === "SHOP_ADMIN") {
            payload.approved = userDetails.approved;
            payload.shopId = userDetails.shopId;
        }
        resolve(payload);
    });
}



module.exports = router;    