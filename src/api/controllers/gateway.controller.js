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
            GWUserName,
            GWuserRole;
    
        const createdUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hashPassword(req.body.password),
            role: req.body.role
        });
        
    
        GWUserID = createdUser.id;
        GWUserName = createdUser.GWUserName;
        GWuserRole = createdUser.role;

        if (GWuserRole === 'SUPER_ADMIN') {
            return res.status(201).json({
                message: `Super Admin Created.`,
                data: createdUser,
            });
        }

        const { MSURL, MSPrefix } = await _getMSURLAndPrefix(GWuserRole);  
        _apiAdapter = apiAdapter(MSURL);
        
        // todo: seperate logic in a service file
        _apiAdapter.post(`/${MSPrefix}/signup`, { GWUserID, GWUserName })
            .then(async serviceRes => {
                console.log("####### response form microService #####", serviceRes.data);
                res.status(201).json({
                    message: `user created successfuly in both GATEWAY and ${MSPrefix} services`,  // change msg
                    data: createdUser, // delete password
                });
            });
    } catch (e) {
        next(e);
    }
});
// TODO: refacotr
router.post('/login', validate(), async (req, res, next) => {
    try {
        let _apiAdapter,
            GWUserID,
            GWuserRole;

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(200).json({ success: false, message: 'Incorrect login credentials.' });
            

        if(! await bcrypt.isValidPassword(req.body.password, user.password)) // return res.status(401).send("Invalid password");
            return res.status(200).json({ success: false, message: 'Incorrect login credentials.' });
        /*
            i need to store shopId in jwt, don't save admin permissions in jwt for these reasons:
            i also need to make a request to the service to get user details (shop-admin or customer);
        */

       GWUserID = user.id;
       GWuserRole = user.role;

       if(GWuserRole === 'SUPER_ADMIN') { 
            const token = await jwt.signToken({ id: GWUserID, role: GWuserRole })
            return res.status(200).json({
                success: true,
                msg: 'super admin is logged in, welcome ya kebeer',
                data: {'userid': user._id, 'name': user.name, 'email': user.email, 'role': user.role},
                token    
            })
        }

       const { MSURL, MSPrefix } = await _getMSURLAndPrefix(GWuserRole);
       _apiAdapter = apiAdapter(MSURL);


       _apiAdapter.get(`/${MSPrefix}/${GWUserID}`)
            .then(async serviceRes => {
                console.log("####### response form microService #####", serviceRes.data);
                const payload = await _setTokenPayload(GWUserID, GWuserRole, serviceRes.data)  
                const token = await jwt.signToken(payload);
                
                res.status(200).json({
                    success: true,
                    msg: `logged in successfuly, welcome`,
                    data: { 'userid': user._id, 'name': user.name, 'email': user.email, 'role': user.role},
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
        let payload = {
            id: GWUserID,
            role: GWuserRole
        };

        if (GWuserRole === "SHOP_ADMIN") {
            payload.approved = userDetails.approved;
            payload.activated = userDetails.activated;
            payload.shopId = userDetails.shopId;    
        }
        resolve(payload);
    });
}



module.exports = router;    