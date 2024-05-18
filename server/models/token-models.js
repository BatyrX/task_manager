const {Schema, model} = require('mongoose');

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    refeshToken: { type: String },

});

module.exports = model('Token', TokenSchema);