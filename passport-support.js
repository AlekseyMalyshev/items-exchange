
'use strict';

module.exports.strategy = (username, password, done) => {
  console.log('In Strategy', username, password);
  pg.connect(conString, (err, client, donePg) => {
    if (err) {
      return console.error('error fetching ', err);
    }
    else {
      console.log(username, password);
      client.query('select * from users where username = $1', [username], (err, result) => {
        donePg();
        if (err) {
          console.log('error ', err);
          return;
        }
        else if (result.rows.length !== 1) {
          console.log('error ', err);
          return;
        }
        else {
          console.log(result.rows);
          done(null, {username: username});
        }
      });
    }
  });
};

module.exports.serialize = (obj, done) => {
  console.log('In serialization', obj);
  done(null, obj)
}

module.exports.deserialize = (obj, done) => {
  console.log('In deserialization', obj);
  done(null, obj)
}