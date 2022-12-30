const fs = require('fs')
const https = require('https')
const path = require('path');
const express = require('express');
const helmet = require('helmet')
const passport = require('passport')
const cookieSession = require('cookie-session')
const { Strategy } = require('passport-google-oauth20')

require('dotenv').config()

const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2, // может понадобиться, если захотим сделать ротацию ключей (для секьюрности)
}

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log('Google profile', profile);
  done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

// Сохранение сессии в куках
passport.serializeUser((user, done) => {
  done(
    null, // обработка ошибок, Null
    user.id // сетаем юзера в куки (здесь юзера можно брать из БД)
  )
})
// Чтение сессии из куков
passport.deserializeUser((id, done) => {
  done(
    null, // обработка ошибок, Null
    id // это из куков пойдет в request
  )
})

const app = express(); // app - это express listener

app.use(helmet())
app.use(cookieSession({
  name: 'session', // имя куки
  maxAge: 24 * 60 * 60 * 1000, // сколько времени будет жить кука, сделаем 1 день
  // здесь можт быть любая строка, можно сенерировать с помощью пароль-генератора
  // ее лучше не хранить в кодовой базе, а вынести в .env
  keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2]
}))
app.use(passport.initialize())
app.use(passport.session())

function checkLoggedIn(req, res, next) {
  // req сетается в deserializeUser(читаются данные из куков), 
  // которые туда попадают после serializeUser, которые попадают туда из verifyCallback
  // isAuthenticated - метод, встроенный в passport
  const isLoggedIn = req.isAuthenticated() && req.user
  if (!isLoggedIn) {
    res.status(401).json({
      error: 'User is not logged in!'
    })
  }
  next()
}

app.get('/auth/google', passport.authenticate('google', {
  scope: ['email'] // это мы получим из данных гугла по поользователю
}))

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure", // редирект, если логин зафейлился
    successRedirect: "/", // то же, только если успех
    session: true, // закончим сессию
  }),
  (req, res) => {
    console.log("Google called us back!");
  }
);

app.get('/auth/google/logout', (req, res) => {
  // встроенный метод в passport. 
  // Сессия в куках обновляется на пустой объект (зашифрован в base 64)
  req.logout()
  return res.redirect('/')
})

app.get('/secret', checkLoggedIn, (req, res) => {
  return res.send('Your personal secret value is 42!');
});

app.get('/failure', (req, res) => {
  return req.send('Fail to log in')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });