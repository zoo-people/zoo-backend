const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const generateValueString = require('../data/utils.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/api/habitats', async(req, res) => {
  try {
    const data = await client.query('SELECT * from habitats');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/animals', async(req, res) => {
  try {
    const data = await client.query('SELECT * from animals');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/animals/:habitatId', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT 
    animals.id,
    animals.name,
    animals.species_name,
    animals.image_url,
    animals.icon_url,
    animals.description, 
    animals.diet 
    FROM animals
    INNER JOIN habitats 
    ON animals.habitat_id = habitats.id
    WHERE animals.habitat_id = $1
    `, [req.params.habitatId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/api/zoos', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT * FROM zoos 
    INNER JOIN animals
     ON zoos.animal_id = animals.id INNER JOIN habitats ON habitats.id = animals.habitat_id
     WHERE zoos.user_id = $1`,
    [req.userId]);
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/zoos', async(req, res) => {
  try {
    const data = await client.query(`INSERT INTO zoos (
      user_id,
      animal_id
    )
      ${generateValueString(req.body.animal_ids.length)}
    RETURNING *;`, 

    [req.userId, ...req.body.animal_ids]);
    res.json(data.rows[0]);

  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/zoos/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE FROM zoos WHERE user_id = $1 AND animal_id = $2 RETURNING *;',
      [req.userId, req.params.id]);
    console.log(req.userId);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;


