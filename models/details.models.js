const mongoose = require('mongoose');

// //Schema definition
 const detailsSchema = new mongoose.Schema({


  NameoftheUPSI: {
   type: String,
    required: true,
          },

       InfoSharedBy: {
         type: String,
         required: true,
     },

        PANNumber1: {
        type: String,
        required: true,
     },

       InformationSharedInCapacity1: {
        type: String, 
       },

       Designation1: {
        type: String,
      },

        InfoSharedTo: {
         type: String,
         required: true,
       },

       PANNumber2: {
        type: String,
        required: true,
       },

       InformationSharedInCapacity2: {
        type: String, 
       },

       Designation2: {
        type: String,
      },
      
       TypeofOrganization: {
         type: String,
         required: true,
       },

      NameoftheOrganization: {
        type: String,
        required: true,
       },

       DateofSharing: {
         type: Date, 
         default: Date.now 
       },

      ParticularofInfoShared: {
        type: String,
        required: true,
       },

      PurposeofSharing: {
        type: String,
        required: true,
       },

      ModeofSharing: {
        type: String,
    },
    TimeofSharing: {
      type: String,
    }

  });
       //Model creation
 module.exports = mongoose.model('UPSIdata', detailsSchema);