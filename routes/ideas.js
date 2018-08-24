//THIRD PARTY MODULES
const express = require('express');
const router = express.Router();

//CUSTOM MODULE FILES
const { Idea } = require('./../models/Idea');
const { authenticate } = require('./../middleware/auth');
//IDEA ROUTES

//GET - '/ideas/add' - Form for Idea add
router.get('/add', authenticate, (req, res) => {
    res.render('ideas/add');
});

//POST - '/ideas' - ADD NEW IDEA
router.post('/', authenticate, (req, res) => {
    const title = req.body.title;
    const details = req.body.details;
    let errors = [];

    if (!title) {
        errors.push({text: 'Please Add Title'});
    }
    if (!details) {
        errors.push({text: 'Please Add Details'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title,
            details
        });
    } else {
        let idea = new Idea({
            title,
            details,
            _creator: req.user.id
        });

        idea.save().then((idea) => {
            req.flash('success_msg', 'Video Idea Added Successfully');
            res.redirect('/ideas');
        }).catch((e) => {
            res.status(400).send();
        });
    }
});

//GET - /ideas - FETCH ALL IDEAS
router.get('/', authenticate, (req, res) => {
    Idea.find({
        _creator: req.user.id
    }).sort({date: 'desc'}).then((ideas) => {
        res.render('ideas/ideas', {ideas});
    }).catch((e) => {
        res.status(400).send();
    })
});

//GET - /ideas/:id/edit - SHOW EDIT IDEA FORM
router.get('/:id/edit', authenticate, (req, res) => {
    Idea.findOne({
        _id: req.params.id,
    }).then((idea) => {
        if (idea._creator !== req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {idea});
        }
    });
});

//PUT - /ideas/:id - UPDATE THE IDEA VIA EDIT FORM
router.put('/:id', authenticate, (req, res) => {
    Idea.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            title: req.body.title,
            details: req.body.details
        }
    }).then(() => {
        req.flash('success_msg', 'Video Idea Updated Successfully');
        res.redirect('/ideas');
    });
});

//DELETE - /ideas/:id - DELETE The IDEA
router.delete('/:id', authenticate, (req, res) => {
    Idea.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Video Idea Removed Successfully');
        res.redirect('/ideas');
    })
});

module.exports = router;