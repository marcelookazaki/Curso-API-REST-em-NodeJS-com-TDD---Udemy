const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'Segredo!';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const parans = {
    secretOrkey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(parans, (payload, done) => {
    app.services.user.findOne({ id: payload.id })
      .then((user) => {
        if (user) done(null, { ...payload });
        else done(null, false);
      }).catch((err) => done(err, false));
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
