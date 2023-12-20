# Express JS Full Course Source Code

This repository contains the Express API built from my Express JS Full Course video. All of the code written in the video course can be found here.

## Features

- Examples of `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests.
- Modular routers & organized endpoints. See `src/routes`.
- Request Validation using [`express-validator`](https://express-validator.github.io/docs).
- Examples of custom middleware implementation
- Cookies, Sessions & Session Store Implementation
- Connecting to MongoDB using [Mongoose](https://mongoosejs.com/docs/)
- Authentication using [Passport.js](https://www.passportjs.org/) featuring local strategy and OAuth2 using Discord (can be replaced with your own provider.)
- Hashing Passwords using [bcrypt](https://www.npmjs.com/package/bcrypt).
- Unit Testing examples using [Jest](https://jestjs.io/). See `src/__tests__`.
- Integration & E2E Testing examples using [Supertest](https://www.npmjs.com/package/supertest). See `src/e2e`.

## Installation

_Note_: You will need MongoDB running locally on your machine.

1. Clone this repository
2. Run `npm install`
3. Run `npm run start:dev`
4. Server will connect to MongoDB & run on Port 3000.
