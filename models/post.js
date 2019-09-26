var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now,
            }
            
        }
    ],
    date: {
        type: Date,
        defalt: Date.now,
    }
    
});

const Post = mongoose.model('post', postSchema)
module.exports = Post;
