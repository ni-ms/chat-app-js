// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    username: {type: String, required: true, unique: true}, email: {type: String, unique: true, required: true},
});
// plugin for passport-local-mongoose
UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});


// const FacebookUserSchema = new Schema({
//     username: {type: String, required: true, unique: true},
//     email: {type: String, unique: true, required: true},
//     facebookId: {type: String, unique: true} // field for storing the Facebook ID
// });
// FacebookUserSchema.plugin(passportLocalMongoose, {usernameField: 'username'});

// Define the Message schema
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', // Assuming you have a User schema for user information
        required: true,
        index: true // Add an index on the sender field
    }, recipient: {
        type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', // Assuming you have a User schema for user information
        required: true,
        index: true // Add an index on the recipient field
    }, content: {
        type: String, required: true,
        validate: { // Add a validation function on the content field
            validator: function (value) {
                return value.length > 0 && value.length <= 500; // Check if the message is not empty or too long
            },
            message: 'Message should be between 1 and 500 characters'
        }
    }, timestamp: {
        type: Date, default: Date.now
    }
});

// Add a virtual property to get the formatted date of the message
messageSchema.virtual('date').get(function () {
    return this.timestamp.toLocaleDateString();
});

module.exports = mongoose.model('Message', messageSchema);

// // export FacebookUserSchema
// module.exports = mongoose.model("FacebookUser", FacebookUserSchema);

// export userschema
module.exports = mongoose.model("User", UserSchema);