# assessment-nodejs

# Requirements
Dooked up a small server, and a sma

    1. docker 18.09.5
    2. node v10.15.3
    3. npm 6.10.0

# How do I run this?

First we must download a mongodb image from docker, create and instantiate the container, it is not necessary if you have mongo in your localhost.

    $ docker run -d -p 27017-27019:27017-27019 --name mongodb mongo:4.0.4

Second, this has a `package.json`, so you'll need to run `npm install` in the directory. 

    $ npm install

We will modify and the name of the sample config file and edit the values that are necessary.

    $ mv config.js.sample config.js

We created two users, one with admin role and another user role.

    $ node models/create.js

we start the server
    
    $ npm start

 Execute the tests

    $ npm test


# Some sample curl requests with USER role ADMIN


## GET - List Routes

    $ curl -isS 127.0.0.1:8081/ | json
    HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: 124
    Date: Mon, 08 Jul 2019 08:07:50 GMT
    Connection: keep-alive

    [
    "POST    /login",
    "GET     /user/:id",
    "GET     /user/name/:name",
    "GET     /policies/:name",
    "GET     /policies/:number/user"
    ]


## POST - Login

    $ curl -iSs -X POST http://127.0.0.1:8081/login  -H 'Content-Type: application/json' | json
    HTTP/1.1 200 OK                                                                                                                                                                  
    Content-Type: application/json                                                                                                                                                                    
    Content-Length: 172                                                                                                                                                                                   
    Date: Mon, 08 Jul 2019 08:28:51 GMT                                                                                                                                                                          
    Connection: keep-alive                                                                                                                                                                                         

    {
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1NjI1NzQ1MzIsImV4cCI6MTU2MjY2MDkzMn0.EwVkoukumC_gYSYoUe1cOnWDGIGB8W4ARSdDpw_98D4"
    }



## GET - User by ID

    $ curl -iSs -X GET http://127.0.0.1:8081/user/ac2487f3-af05-40e3-98ea-360482dcf1e0  -H 'Content-Type: application/json' -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1NjI1NzQwMDgsImV4cCI6MTU2MjY2MDQwOH0.KYbvfb2jRFXztQ0HlFmv0xkpoCJJsxh8iKs3fhSapiY' | json
    HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: 120
    Date: Mon, 08 Jul 2019 08:32:36 GMT
    Connection: keep-alive

    {
    "id": "ac2487f3-af05-40e3-98ea-360482dcf1e0",
    "name": "Roberts",
    "email": "robertsblankenship@quotezart.com",
    "role": "admin"
    }


## GET - User by name

    $ curl -iSs -X GET http://127.0.0.1:8081/user/name/roberts  -H 'Content-Type: application/json' -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1NjI1NzQwMDgsImV4cCI6MTU2MjY2MDQwOH0.KYbvfb2jRFXztQ0HlFmv0xkpoCJJsxh8iKs3fhSapiY' | json
    HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: 120
    Date: Mon, 08 Jul 2019 08:32:03 GMT
    Connection: keep-alive

    {
    "id": "ac2487f3-af05-40e3-98ea-360482dcf1e0",
    "name": "Roberts",
    "email": "robertsblankenship@quotezart.com",
    "role": "admin"
    }


## GET - Policies by User

    $ curl -iSs -X GET http://127.0.0.1:8081/policies/britney  -H 'Content-Type: application/json' -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1NjI1NzQwMDgsImV4cCI6MTU2MjY2MDQwOH0.KYbvfb2jRFXztQ0HlFmv0xkpoCJJsxh8iKs3fhSapiY' | json
    [ 
    ...
    {
        "id": "e626d069-fd2c-4211-99b6-67ed9e867387",
        "amountInsured": 1695.35,
        "email": "inesblankenship@quotezart.com",
        "inceptionDate": "2015-04-11T06:01:29Z",
        "installmentPayment": true,
        "clientId": "a0ece5db-cd14-4f21-812f-966633e7be86"
    },
    {
        "id": "0df3bcef-7a14-4dd7-a42d-fa209d0d5804",
        "amountInsured": 705.14,
        "email": "inesblankenship@quotezart.com",
        "inceptionDate": "2014-05-11T12:28:41Z",
        "installmentPayment": false,
        "clientId": "a0ece5db-cd14-4f21-812f-966633e7be86"
    }
    ...
    ]


## GET - Policies by Numer - User

    $ curl -iSs -X GET http://127.0.0.1:8081/policies/7b624ed3-00d5-4c1b-9ab8-c265067ef58b/user  -H 'Content-Type: application/json' -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1NjI1NzQwMDgsImV4cCI6MTU2MjY2MDQwOH0.KYbvfb2jRFXztQ0HlFmv0xkpoCJJsxh8iKs3fhSapiY' | json
    HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: 120
    Date: Mon, 08 Jul 2019 08:53:01 GMT
    Connection: keep-alive

    {
    "id": "a0ece5db-cd14-4f21-812f-966633e7be86",
    "name": "Britney",
    "email": "britneyblankenship@quotezart.com",
    "role": "admin"
    }
