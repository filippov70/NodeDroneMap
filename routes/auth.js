/* 
 * Copyright (C) 2016 Filippov Vladislav
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */


var passport = require('passport');
var path = require("path");

module.exports = function (app) {

    /*роут на получение данных*/
    app.get('/data', function (req, res) {
        var lname = req.param('lname');
        //console.log(lname);
        if (lname) {
            res.sendfile(path.join(__dirname + '/..'
                    + '/server/data/' + lname + '.geojson'));
            return;
        }

        var img = req.param('img');
        //console.log(lname);
        if (img) {
            res.sendfile(path.join(__dirname + '/..'
                    + '/server/data/img/' + img + '.jpg'));
            return;
        }
        //res.redirect('/auth');
    });

    /*роут на admin*/
    app.get('/admin', function (req, res) {
        if (req.isAuthenticated()) {
            res.sendfile(path.join(__dirname + '/..' + '/public/admin.html'));
            return;
        }

        res.redirect('/auth');
    });

    /*роут на auth*/
    app.get('/auth', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/admin');
            return;
        }

        res.render('auth.jade', {
            error: req.flash('error')
        });
    });

    app.get('/', function (req, res) {
        return;
    });

    /*роут на главную страницу*/
//    app.get('/', function (req, res) {
//
//        if (req.isAuthenticated()) {
//            res.render('index.ejs', {
//                user: req.user
//            });
//            return;
//        }     
//           
//        res.redirect('/auth');
//    });     

    /*роут на logout*/
    app.get('/sign-out', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    /* Обработка POST-данных авторизации */
    app.post('/auth',
            passport.authenticate('local',
                    {
                        successRedirect: '/admin',
                        failureRedirect: '/auth',
                        failureFlash: true
                    }
            )
            );

//    app.post('/setimg', function (req, res, next) {
//        try {
//            console.log('files', req.files);
//            res.status(200);
//            res.end();
//        } catch (error) {
//            console.log(error);
//            res.status(500);
//            res.end();
//        }
//    });

    app.post('/setdata', function (req, res, next) {
        try {
            var dataValue = req.body.data;
            var polyCoord = req.body.polygon;
            var point1Coord = req.body.point1;
            var point2Coord = req.body.point2;
            var point1File = req.body.point1file;
            var point2File = req.body.point2file;
            console.log(dataValue, polyCoord, point1Coord, point1File, point2Coord, point2File);
            //req.body содержит данные, переданные от клиента
            res.status(200);
            res.end();
        } catch (error) {
            console.log(error);
            res.status(500);
            res.end();
        }
    });

};