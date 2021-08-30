const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
                  
              CREATE TABLE habitats (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(256) NOT NULL,
                    image VARCHAR(1200)
              );
              CREATE TABLE animals (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(1200) NOT NULL,
                  species_name VARCHAR(1200) NOT NULL,
                  habitat_id INTEGER NOT NULL REFERENCES habitats(id),
                  image_url VARCHAR(1200) NOT NULL,
                  icon_url VARCHAR(1200) NOT NULL,
                  description VARCHAR(1200) NOT NULL,
                  diet VARCHAR(256) NOT NULL
              );
              CREATE TABLE zoos (
                user_id INTEGER NOT NULL REFERENCES users(id),
                animal_id INTEGER NOT NULL REFERENCES animals(id),
                
               
              )
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
