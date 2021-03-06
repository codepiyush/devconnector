const express = require("express")
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//importing model
const Profile = require('../../models/profile');
const User = require('../../models/user');

//importing validator 

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


router.get("/test", (req, res) => {
    res.json({ msg: "this is profle test" })
})


router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'there is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err));
});
//create or update route for profile
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateProfileInput(req.body)

    if (!isValid) {
        console.log(req.body.skills.replace(/\s/g, '').split(','))
        return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.status) profileFields.status = req.body.status
    if (req.body.githubUserName) profileFields.githubUserName = req.body.githubUserName
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.replace(/\s/g, '').split(',')
    }
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                mongoose.Types.ObjectId.isValid(req.user.id);
                Profile.findOneAndUpdate({ user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                    .then(profile => res.json(profile))
                    .catch(err => console.log(err))

            } else {
                //create
                //check if handel exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errors.handle = "handle already exixts"
                            res.status(400).json(errors);
                        }

                        //save profile

                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
            }
        })

});

//search profile by handle
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this handle';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//get profile by user id

router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this handle';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({ profile: 'There is no profile by this id' }));
});

//get all profile

router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noProfile = "There are no profile"
                res.status(404).json(errors)
            }
            res.json(profiles)
        })
        .catch(err => res.status(404).json({ profiles: 'There are no profile' }))
});


//add experience to profile

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.noProfiledescription,
            }

            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
});

//add education route

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                fieldOfStudy: req.body.fieldOfStudy,
                degree: req.body.degree,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.noProfiledescription,
            }

            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        })
});

//deleting experience
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
    .then(profile=>{
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        profile.save().then(profile=> res.json(profile))
    })
    .catch(err=> res.status(404).json(err))
});


//deleting education
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({user: req.user.id})
    .then(profile=>{
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        profile.save().then(profile=> res.json(profile))
    })
    .catch(err=> res.status(404).json(err))
});

//delete user and profile

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOneAndRemove({user: req.user.id})
    .then(()=>{
        User.findOneAndRemove({_id: req.user.id})
        .then(()=> res.json({success: true}))
    })
})

module.exports = router;