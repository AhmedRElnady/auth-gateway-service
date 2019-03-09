
const express = require('express');
const routers = require('../micro-services-routers');
const app = express();
const bodyParser = require('body-parser')
const {connect} = require('../config/db/mongoose');


const gatewayRoutes = require('../api/controllers/gateway.controller');

function bootstrap(port, dbHost, dbName) {
   return new Promise(async (resolve, reject) => {
    const dbInstance = await connect(dbHost, dbName);

    app.use((req, res, next)=> {
        req.db = dbInstance;
        next();
    });

    app.use('/', (req, res, next) => {

        let contype = req.headers['content-type'];
        if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
            return res.status(415).send({ error: 'Unsupported Media Type (' + contype + ')' });
    
        next();
    });


    app.use(bodyParser.json({ limit: '100mb'}));
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(gatewayRoutes);
    app.use('/api', routers);

    process.on('uncaughtException', (err)=> {
        console.log(">>>> err ", err);
    });

    process.on('unhandledRejection', (err)=> {
        console.log(">>> .... err .... >>>>", err);
    })

    const server = app.listen(port, ()=> {
        console.log(`.... Api-Gateway server started on port ${port} ....`)
             
    })
    resolve(server); 
   })   
}

module.exports = { bootstrap };