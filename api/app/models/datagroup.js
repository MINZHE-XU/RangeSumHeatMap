// app/models/datagroup.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//defines the schema for the files in data base
//please refer to JsonExample to follow th data format stored in groupeddata
var DatagroupSchema = new Schema({groupeddata: String});

module.exports = mongoose.model('Datagroup', DatagroupSchema);
