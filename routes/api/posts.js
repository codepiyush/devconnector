const express = require("express")
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

//importing model

const Post = require('../../models/post');
const Profile = require('../../models/profile')

//importing post route

const validatePostInput = require('../../validation/post');

router.get("/test", (req, res) => {
    res.json({ msg: "this is post test" })
});



//route to fetch all post

router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopost: 'no posts found' }));
})

//get post by id
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopost: 'no post found with that id' }))
})
//route for posting
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    const newpost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    })
    newpost.save()
        .then(post => {
            res.json(post)
        })
        .catch(err => res.status(400).json(err));
});

//delete post route
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check if user owns the post
                    if (post.user.toString() !== req.user.id) {
                        res.staus(401).json({ notauthorise: 'user not authorise' })
                    }

                    post.remove().then(() => res.json({ success: true }))
                })
                .catch(err => res.status(404).json({ postnotfound: 'no post found' }))
        })
})



//implementing likes
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'user already liked this post' })
                    }
                    //add user id to liked array
                    post.likes.unshift({ user: req.user.id })
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({ nopost: 'no post found' }))
        })
});

//implementing unlikes
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({ notliked: 'you have not yet liked your post' })
                    }
                    //get index of user to unlike
                    const removeindex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
                    post.likes.splice(removeindex, 1);

                    //save
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({ nopost: 'no post found' }))
        })
});

//adding comment to a post
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }
    console.log(req.params.id)
    Post.findById(req.params.id)
        .then(post => {
            const newcomment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //add comment to post
            post.comments.unshift(newcomment);

            //save post
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found', err }))
});

//delete comment route
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ nocomment: 'comment does not exist' })
            }
            const removeindex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
            post.comments.splice(removeindex,1);

            //save post
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found', err }))
});

module.exports = router;