# NestJS Tutorial Repository

Repository will be separated into `server` and `client` directory for **NestJS** backend and **Angular** frontend resepctively. 

- [x] Server repository
- [x] Client repository
- [x] Docker support
- [x] Hook up Server and Client

## Server-side (NestJS)

This repository houses the Project's backend written using **NestJS**

- **NSwag**: Nswag allows us to generate API Calls to our Backend on our Frontend in forms of Functions. The abstraction of **HttpClientModule** takes place in the generated file.
- **Steps**:
    1. `cd ./server` & `npm i` to install all dependencies for Server side
    2. Have an instance of **MongoDB** running (`mongod`). If you use an IDE like WebStorm, I have a script called: `mongo:local` that is going to run `mongod` subsequently so you can setup a `Compound Run Configuration` with `start:dev` and `mongo:local` to start the Backend with ease.
    3. `npm run start:dev` to start the server
- **Note**: If there's issue connecting to local MongoDB and you make sure that you already have `mongod` running, go to `config/default.ts` and check if the `MONGO_URI` is correct. 


## Client-side (Angular)

This repository houses the Project's frontend written using **Ionic and Angular 8**

- **Ionic Design**: The components design is by Ionic (https://ionicframework.com/docs/components). 
- **Steps**: `npm i` to install all the dependencies then just start the application with `ng serve`

## Docker

Docker is supported.

- **Branch**: `docker`
- **Steps**: Just clone the repository, check out `docker` branch then from `root` directory, run `docker-compose up` and Docker will take over.
- **Note**: Angular application will be served by NGINX on `localhost`; Nest application will be running on `localhost:3000`; **cAdvisor** which monitors our containers will be running on `localhost:8080`. Again, it's worthwhile to explore the Dockerfile in both `client` and `server` directory; also `nginx.conf` and `docker-compose.yml` to get the gist of how Docker and Docker Compose work.

P.S: Pull Requests, Contributions are most definitely welcomed :)
