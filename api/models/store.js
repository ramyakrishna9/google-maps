const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    storeName: String,
    phoneNumber: String,
    address: {},
    openStatusText: String,
    addressLines: Array,
    location: {
       type: {  
            type: String,
            enum: ['point'],
            required: true
        },  
        coordinates: {
            type: [Number],
            required: true
        }
    }    
});

storeSchema.index({ location: '2dsphere' }, { sparse: true });

module.exports = mongoose.model('store', storeSchema);