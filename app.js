const express = require('express');
const mongoose = require('mongoose');
const app = express();
const axios = require('axios');
const port = 3000;
const Store = require('./api/models/store'); 
const GoogleMapsService = require('./api/service/googleMapsService');
const googleMapsService = new GoogleMapsService();
require('dotenv').config();

app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', "*");
    next();
})


mongoose.connect('mongodb+srv://mahi:us8s5uQmsbC5NwPZ@cluster0.kue8i.mongodb.net/<dbname>?retryWrites=true&w=majority', 
   {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       useCreateIndex: true,
    });

app.use(express.json({ limit: '50mb' }));
app.post('/api/stores', (req,res) => {
    let dbStores= [];
    let stores = req.body;
    stores.forEach((store)=> {
        dbStores.push({
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location:{
                type: 'point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude
                ]
            }
        })
    })
    Store.create(dbStores, (err,stores) => {
        if(err){
            res.status(500).send(err);

        } else{
            res.status(200).send(stores);
        }
    })
   // console.log(dbStores);
    /*var store = new Store({
        storeName: "Test",
        phoneNumber: "9898989898",
        location: {
            type: 'point',
            coordinates: [
                -118.376354,
                34.063584
            ]
        } 
    })
    store.save();*/
    //res.send("you have posted");
});

//db password us8s5uQmsbC5NwPZ

app.get('/api/stores', (req, res) => {
    const zipCode = req.query.zip_code;
     googleMapsService.getCoordinates(zipCode)
    .then((coordinates)=>{
        Store.find({
            /*location: {
                $near: {
                 $maxDistance: 3218,
                 $geometry: {
                   type: "Point",
                   coordinates: coordinates
                 }
                }
            }*/
        }, (err,stores)=>{
            if(err){
                res.status(500).send(err);
            } else {
                res.status(200).send(stores);
            }

        })
    }).catch((error)=>{
       
        console.log(error);
    })
    //this is the buffer to find the stores through the postman
    //Store.find({},(err, stores) => {})

})

app.delete('/api/stores', (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(200).send(err);
    })
})
app.listen(port, () => console.log(`Example app Listening at http://localhost:${port}`))