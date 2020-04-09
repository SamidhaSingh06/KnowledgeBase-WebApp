const express = require('express');
const router = express.Router();

// Bring in Article Model
let Article = require('../models/article');

// Bring in User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthentication, (req, res) => {
    res.render('add',{title: "Add Articles"})
});


// Add submit POST Route
router.post('/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;
    article.Author = req.user.name;

    article.save( (err) => {
        if(err)
        {
            console.log(err);
            return;
        }
        else{
            req.flash('success','Article Added');
            res.redirect('/');
        }        
    });
});

// Route for each article
router.get('/add/:id', (req, res) => {
   Article.findById(req.params.id, (err, art) => {
        if(err){
            console.log(err);
            return;
        }
        else{
            User.findById(art.author, (err, user) => {
                res.render('article', {art, author: user.name});
            });
        }        
   }); 
});

// Edit article
router.get("/edit/:id", ensureAuthentication, (req, res) => {
    Article.findById(req.params.id, (err, art) => {
        if(err){
            console.log(err);
            return;
        }
        else if(art.author != req.user._id){
            req.flash('danger', 'Not Authenticated!');
            res.redirect('/');
        }
        else
            res.render('edit', {title: "Editing articles", art});
    });
});

// Update article
router.post("/edit/:id", ensureAuthentication,(req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    Article.updateOne({_id: req.params.id}, article, function(err) {
        if(err)
        {
            console.log(err);
            return;
        }   
        else{
            req.flash('success','Article Updated');
            res.redirect('/');
        }        
    });
});

// Delete Articles
router.delete('/:id', (req,res) => {
    Article.deleteOne({_id: req.params.id} , (err) => {
        if(err){
            console.log(err);
        }
        else{
            req.flash('danger','Article Deleted');
            res.send('success');
        }
    });
});

// Delete Articles using post request
router.post('/:id', (req, res) => {
    Article.deleteOne({_id: req.params.id}, (err) => {
        if(err)
            console.log(err);
        else{
            req.flash('danger','Article Deleted');
            res.redirect('/');
        }                    
    });
});

// Access Control
function ensureAuthentication(req, res, next){
    if(req.isAuthenticated())
        return next();
    else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;