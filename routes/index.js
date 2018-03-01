

var express = require('express');
var router = express.Router();
var config = require('config');
var request = require('request');
var url = config.get('lbry_api.host');
var port = config.get('lbry_api.port');
var is_dev = config.get('dev');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/index', function(req, res, next){
    res.render('index');
});

router.get('/template', function(req, res, next){
  res.render('template');
});

router.get('/invite', function(req, res, next){
  res.render('invite');
});

router.get('/user_approve', function(req, res, next){
  res.render('user_approve');
});

router.get('/user_merge', function(req, res, next){
  res.render('user_merge');
});

router.get('/file_block', function(req, res, next){
  res.render('file_block');
});

router.get('/settings', function(req, res, next){
  res.render('settings');
});

router.get('/logout', function(req, res, next){
    res.render('logout');
});


router.post('/', function(req, res, next){
    var auth_token = req.body.auth_token;
    var options = {
        url: 'http://' + url + ":" + port +'/user/me',
        form: {
            auth_token: auth_token
        }
    };
    request.post(options, function (err,response,body) {
        data = JSON.parse(body);
        if(data.success === true){

            if(data.data.groups.indexOf("admin") > -1){
                res.render('login', {
                    success: data.success,
                    auth_token: options.form.auth_token
                });
            }
            else{
                res.render('login', {
                   error: "You are not authorized to access this page"
                });
            }
        }
        else{
            res.render('login', {
                error: data.error
            });
        }
    })
});
module.exports = router;
