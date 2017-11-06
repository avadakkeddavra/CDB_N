var request = require('request');
var http = require("http");
var querystring = require('querystring');
var util = require('util');

responseData = '';
balance = '';

    request({
        method: 'POST',
        uri: 'https://ru.cs.deals/ajax/botsinventory',
        headers:{
            'referer': "https://ru.cs.deals/",
            'body': 'helo',
            'content-type': 'application/json',
            'x-requested-with':'XMLHttpRequest'
        }

    }, function (error, response, body) {
        responseData =  body;
    });


http.createServer(function(req, response){




    console.log(req.url);
    if(req.url == '/getArray')
    {
        response.end(responseData);

    }else if(req.url == '/getSteamId'){

        var post = '';

        req.on('data',function(chunk){
            post += chunk;
        });

        req.on('end', function(){
            post = querystring.parse(post);
            var sessionID = String(post.sessionID);

            sessionID = 'sessionID='+sessionID;
            console.log(sessionID);

                request({
                    method: 'POST',
                    uri: 'https://ru.cs.deals/',
                    headers:{
                        'referer': "https://ru.cs.deals/",
                        'content-type': 'application/json',
                        'x-requested-with':'XMLHttpRequest',
                        'cookie':sessionID
                    }

                }, function (error, res, body) {
                    console.log(body.slice(body.indexOf('g_steamID')+13,body.indexOf('g_steamID')+30));
                    response.end(body.slice(body.indexOf('g_steamID')+13,body.indexOf('g_steamID')+30));
                });

        });

    }else if(req.url == '/balance'){

        var post = '';

        req.on('data',function(chunk){
            post += chunk;
        });

        req.on('end', function(){
            post = querystring.parse(post);
            var sessionID = String(post.sessionID);

            sessionID = 'sessionID='+sessionID;
            console.log(sessionID);

                request({
                    method: 'POST',
                    uri: 'https://ru.cs.deals/',
                    headers:{
                        'referer': "https://ru.cs.deals/",
                        'content-type': 'application/json',
                        'x-requested-with':'XMLHttpRequest',
                        'cookie':sessionID
                    }

                }, function (error, res, body) {
                    response.end(body.slice(body.indexOf('g_balance')+12,body.indexOf('g_balance')+17));
                });

        });

    }else if(req.url == '/trade'){
        var post = '';

        req.on('data',function(chunk){
            post += chunk;
        });

        req.on('end', function() {
            post = querystring.parse(post);
            var sessionID = post.sessionID;
            sessionID = 'sessionID='+sessionID;

            var bot = post.bot;
            var ids = post.ids;
            console.log(bot);
            console.log(ids);
            var formData = {
                id : bot,
                u  : '',
                b  : ids
            };

            request({
                method: 'POST',
                uri: 'https://ru.cs.deals/ajax/trade',
                headers:{
                    'referer': "https://ru.cs.deals/",
                    'content-type': 'application/json',
                    'x-requested-with':'XMLHttpRequest',
                    'cookie':sessionID
                },
                formData: formData
            }, function (error, res, body) {
               response.end(body);
            });
        })
    }
    else
    {
        response.end('No valid request')
    }


}).listen(8000);