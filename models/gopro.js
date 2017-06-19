const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const GoProSchema = new mongoose.Schema({
  geo: {
    type: {
      type: String
    },
    coordinates: [[Number, Number]]
  },
  time: [Date]
})

module.exports = mongoose.model('GoPro', GoProSchema);
