const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const restricted = require('./auth/restricted-middleware');

const userRouter = require('./user/users-router');
const authRouter = require('./auth/auth-router');
const server = express();

const sessionConfig = {
  name: 'chocolate-chip',
  secret: 'myspeshulsecret',
  cookie: {
    maxAge: 3600 * 1000,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    knex: require('./data/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 3600 * 1000,
  }),
};
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use(session(sessionConfig));

server.use('/auth', authRouter);
server.use('/users', restricted, userRouter);

server.get('/', (req, res) => {
  res.send('we are recieving data from the api request api');
});

module.exports = server;
