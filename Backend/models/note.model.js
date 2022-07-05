const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    email: {
        type: String
    },

    title: {
        type: String,
        required: true
    },

    note: {
        type: String,
        required: true
    },

}, {
    timestamps: true,
});

const Note = mongoose.model("note", noteSchema);
module.exports = Note;