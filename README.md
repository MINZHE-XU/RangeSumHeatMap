# RSHM
Welcome to use range sum heat map. Please click "tips" on the application' page to check the user manual

# deployment
## To run the map at localhost:3000
```
cd RSHM
npm install
npm start
```

## To deploy the application on server (Ubuntu 14.04):
1.	Install nginx

2.	 In path :/etc/nginx/nginx.conf
Add the following line after http {
```
include   /etc/nginx/sites-enabled/rshm.conf;
```
3.	create a file in the following path: /etc/nginx/sites-enabled/rshm.conf
and add code
```
server {
        listen 80       ;  #
        server_name  localhost;
        root /root/RSHM;
        location / {
                try_files $uri @fallback;
        }
        location @fallback {rewrite .* /index.html break;}
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
                root html;
              }
        }
```
* I have built a bundle, you can skip step 4 and 5, use the directory "rshm" in root directory if you did not change any file.
4.	In web application’s root path run following codes to install dependencies:
```
$ npm install
```
5.	run following codes to pack the bundles:
```
$ npm run build
```
6.	rename the output directory (build) as “RSHM” and put it in server’s root path.
7.	run following codes to restart ngnix
```
$ sudo service nginx restart
```


## To deploy RSHM server API
1.	install mongodb and run the following code to run mongodb in background
```
$ mongod --fork --logpath /var/log/mongodb/mongod.log
```

2.	In server API directory’s root path (api) run following codes to install dependencies:
```
$ npm install
```

3.	run following codes to start server API in background:
```
$ forever start server.js
```

Back-End Server part: It is responsible for providing API for the application. By calling the API, application can store and get data sets.

After posting a json message containing datapoint information at domain/api, API will return a token. By using get method at domain/api/token_id, API will return the stored file using json format.
Please refer to JsonExample to check the example of exchanged Json format.

# How it works?
Application uses store to contain all the states like data points and drones. When user triggers a new action, it can be dispatched to reducer. Applicaiton uses reducer to change the store, the information in the store will then render on screen.

We cut the store into slices for different data. Add we can use the reducer in /src/reducers to update store
Spots:Array of data points
Drones:Array of source points
Size:Range size
MRs:Array of partitions and range sum
Path:Array of dynamic points
Mode:Algorithm, show mode, object type
StatusPoint:Centered data point, chosen data point, candidate data point array, upload status, download status
Index: if an acton will change several parts in store, we update the store using functions in Index

you can save the file and load file using format as JsonExample.json

# Bulit with
* React-redux
	Application uses react-redux to connect react components with redux store and bind actions as props.  Following codes are deployed in the components to get the data in the store and dispatch reducers in actions.
```
connect([mapStateToProps], [mapDispatchToProps], [mergeProps],[options])
```
* React-bootstrap
	Application uses react-bootstrap to build a responsive layout on different devices. “Panels” are the main unit to contain different components. The application has following main panels: file panel, data point panel, range size panel, algorithm panel, data point list. The panels are collapsible for users to configure.
* React-google-maps
	react-google-maps is a package to wrap Google Maps JavaScript API v3 into react components. “Marker” is the component to render data points, candidate data points, drones on the map. “Rectangle” is the component to render partitions and range sum on the map. ”Polyline” is the is the component to paths on the map.
* Axios
	axios is a package to execute http request for this application. It is implemented in actions to post and get file data from API server.
* Express
	Server side API uses express to listen to the port, router request and respond http request. All the requests are routed to “domain/api”.  The API contains a response for post request at '/datagroups' to store file in database and a response for get request at '/datagroups/:datagroup_id ' to retrieve and return stored Json file to the client.
* Mongoose
	Mongoose is used to format the data schema and drive the mongodb.
* React-scripts
	This application uses react-scripts to bundles React in production mode and optimizes the build for the best performance.
