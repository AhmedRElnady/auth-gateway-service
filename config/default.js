module.exports = {
    MS: {
        shop: {
            url: "http://localhost:4000",
            prefix: "shops"
        }, 
        shop_admin: {
            url: "http://localhost:5000",
            prefix: "shop-admins"
        },
        customer: {
            url: "http://localhost:6000",
            prefix: "customers"
        }
    },
    token: {
        secret: 'elnadySecret',
        expiresIn: '60000'
    }
}