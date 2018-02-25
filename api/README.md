# RSHM_api

deployment:

1.	install mongodb and run the following code to run mongodb in background
$ mongod --fork --logpath /var/log/mongodb/mongod.log

2.	In server API directory’s root path (api) run following codes to install dependencies:
$ npm install

3.	run following codes to start server API in background:
$ forever start server.js


Back-End Server part: It is responsible for providing API for the application. By calling the API, application can store and get data sets.

After posting a json message containing datapoint information at domain/api, API will return a token. By using get method at domain/api/token_id, API will return the stored file using json format.
Please refer to JsonExample to check the example of exchanged Json format.
