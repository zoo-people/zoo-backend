const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const habitatData = require('./habitats.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        const hash = bcrypt.hashSync(user.password, 8);
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, hash]);
      })
    );

    await Promise.all(
      habitatData.map(habitat => {
        return client.query(
          `
          INSERT INTO habitats (name, image)
          VALUES ($1, $2)
          RETURNING *;
          `,
          [habitat.name, habitat.image]
        );
      })
    );

    

  
    // const user = users[0].rows[0];

    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
