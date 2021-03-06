const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const habitatData = require('./habitats.js');
const animalData = require('./animals.js');
const zooData = require('./zoos.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const generateValueString = require('./utils.js');
run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
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
          INSERT INTO habitats (habitat, image)
          VALUES ($1, $2)
          RETURNING *;
          `,
          [habitat.habitat, habitat.image]
        );
      })
    );

    await Promise.all(
      animalData.map(animal => {
        return client.query(
          `
          INSERT INTO animals (
            name,
            species_name,
            habitat_id,
            image_url,
            icon_url,
            description,
            diet)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
          `,
          [animal.name, 
            animal.species_name,
            animal.habitat_id, 
            animal.image_url, 
            animal.icon_url, 
            animal.description, 
            animal.diet]
        );
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      zooData.map(zoo => {
        let str = `
        INSERT INTO zoos (
          user_id,
          animal_id
        )
      ${generateValueString(zoo.animal_ids.length)}

      
        RETURNING *;
        `;
        // console.log(str);
        return client.query(str,
          [user.id, ...zoo.animal_ids]
        );
      })
    );

    // await Promise.all(
    //   zooData.map(zoo => {
    //     `DELETE FROM zoos WHERE user_id = $1 && animal_id = $2 `
    //   })
    // )


    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
