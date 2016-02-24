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


var conf = require('../conf');
var express = require('express');
var passport = require('passport');
var path = require('path');
var flash = require('connect-flash');
var gfproxy = require('./gfproxy');

module.exports = function (app) {

    app.set('port', conf.get("app:port") || 3000);
    app.set('views', path.join(__dirname + "/..", 'views'));
    app.set('view engine', 'jade');

    var sessionOptions = conf.get("session");
    if ('production' === app.get('env')) {
        var MemcachedStore = require('connect-memcached')(express);
        sessionOptions.store = new MemcachedStore(conf.get("memcached"));
    }

    /*proxy for getFeatureInfo*/
    app.use(gfproxy(/\/gf\/(.*)/, ''));

    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname + '/..', 'public')));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);

    if ('development' === app.get('env')) {
        app.use(express.errorHandler());
    }
};