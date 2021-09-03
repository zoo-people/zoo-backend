require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });
    //===============================================================================================================
    test('get all habitats', async() => {

      const expectation = [
        { id:1,
          habitat: 'Polar',
          image: 'https://www.maxpixel.net/static/photo/1x/Ice-Arctic-Landscape-Scenery-Full-Moon-Nightsky-152720.png' },
        { id:2,
          habitat: 'Desert',
          image: 'https://media.istockphoto.com/videos/orange-animated-desert-at-night-video-id545167372?s=640x640'  },
        { id:3,
          habitat: 'Grassland',
          image: 'https://st3.depositphotos.com/29856464/35717/v/600/depositphotos_357176076-stock-video-animation-clouds-moving-wind-field.jpg'  },
        { id:4,
          habitat: 'Rain Forest',
          image: 'https://t4.ftcdn.net/jpg/01/99/31/15/360_F_199311558_L9hwUDU5pd4Mc5n5EYA0J90LlvM79v9K.jpg' },
        { id:5,
          habitat: 'Evergreen Forest',
          image: 'https://live.staticflickr.com/7019/6798337359_0c5303b778_b.jpg' },
        { id:6,
          habitat: 'Living Room',
          image: 'https://i.pinimg.com/originals/f3/40/23/f34023b3ab9b82c5343a874fa2026215.jpg'  },
      ];

      const data = await fakeRequest(app)
        .get('/api/habitats')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    //===============================================================================================================


    test('get aniamals by habitat Id', async() => {

      const expectation = [
        { id:1,
          name: 'Polar Bear',
          species_name: '(Ursus Maritimus)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg/220px-Polar_Bear_-_Alaska_%28cropped%29.jpg',
          icon_url: 'https://image.flaticon.com/icons/png/128/2938/2938245.png',
          description: 'The polar bear is a marine mammal because it spends many months of the year at sea. However, it is the only living marine mammal with powerful, large limbs and feet that allow them to cover kilometers on foot and run on land. Its preferred habita is the annual sea ice covering the waters over the continental shelf and the Arctic inter-island archipelagos.',
          diet: 'carnivore' 
        },
          
        { id:2,
          name: 'Arctic Fox',
          species_name: '(Vulpes lagopus)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Iceland-1979445_%28cropped_3%29.jpg/440px-Iceland-1979445_%28cropped_3%29.jpg',
          icon_url: 'https://cdn-icons-png.flaticon.com/128/1998/1998568.png',
          description: 'The Arctic fox, also known as the white fox, polar fox, or snow fox, is a small fox native to the Arctic regions of the Northern Hemisphere and common throughout the Arctic tundra biome. Arctic foxes form monogamous pairs during the breeding season and they stay together to raise their young in complex underground dens. Occasionally, other family members may assist in raising their young.',
          diet: 'omnivores' 
        },
          
        { id:3,
          name: 'Marmot',
          species_name: '(Marmota flaviventris)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Marmot-edit1.jpg/440px-Marmot-edit1.jpg',
          icon_url: 'https://image.flaticon.com/icons/png/128/2808/2808893.png',
          description: 'Marmots are large rodents with characteristically short but robust legs, enlarged claws well adapted to digging, stout bodies, and large heads and incisors to quickly process a variety of vegetation. While most species are various forms of earthen-hued brown, marmots vary in fur coloration based roughly on their surroundings.',
          diet: 'omnivore' 
        },
          
        { id:4,
          name: 'Reindeer',
          species_name: '(Rangifer tarandus)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Reinbukken_p%C3%A5_frisk_gr%C3%B8nt_beite._-_panoramio.jpg/440px-Reinbukken_p%C3%A5_frisk_gr%C3%B8nt_beite._-_panoramio.jpg',
          icon_url: 'https://image.flaticon.com/icons/png/128/1998/1998773.png',
          description: ' In traditional Christmas legend, Santa Clauss reindeer pull a sleigh through the night sky to help Santa Claus deliver gifts to good children on Christmas Eve.',
          diet: 'herbivore' 
        },
          
        { id:5,
          name: 'Muskox',
          species_name: '(Ovibos moschatus)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Ovibos_moschatus_qtl3.jpg/440px-Ovibos_moschatus_qtl3.jpg',
          icon_url: 'https://image.flaticon.com/icons/png/128/3786/3786837.png',
          description: 'Native to the Arctic, it is noted for its thick coat and for the strong odor emitted by males during the seasonal rut, from which its name derives. Both male and female muskoxen have long, curved horns. Muskoxen live in herds of 12–24 in the winter and 8–20 in the summer.',
          diet: 'herbivore' 
        },
        { id:6,
          name: 'Wolverine',
          species_name: '(Gulo gulo)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Wolverine_on_rock.jpg/440px-Wolverine_on_rock.jpg',
          icon_url: 'https://image.flaticon.com/icons/png/128/371/371743.png',
          description: 'The wolverine has a reputation for ferocity and strength out of proportion to its size, with the documented ability to kill prey many times larger than itself. Wolverines live primarily in isolated arctic, boreal, and alpine regions.',
          diet: 'omnivore' 
        },
      
        { id:7,
          name: 'Canadian Lynx',
          species_name: '(Lynx canadensis)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Canada_lynx_by_Michael_Zahra_%28cropped%29.jpg/220px-Canada_lynx_by_Michael_Zahra_%28cropped%29.jpg',
          icon_url: 'https://image.flaticon.com/icons/png/512/185/185740.png',
          description: 'The Canada lynx is a medium-sized North American lynx that ranges across Alaska, Canada, and northern areas of the contiguous United States. It is characterized by its long, dense fur, triangular ears with black tufts at the tips, and broad, snowshoe-like paws. The lynx is a good swimmer and an agile climber. A specialist predator, the Canada lynx depends heavily on the snowshoe hare for food.',
          diet: 'carnivore' 
        },
      
        { id:8,
          name: 'Arctic Hare',
          species_name: '(Lepus arcticus)',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Arctic_Hare_1.jpg/220px-Arctic_Hare_1.jpg',
          icon_url: 'https://image.flaticon.com/icons/png/128/3867/3867051.png',
          description: 'The Arctic hare is a species of hare highly adapted to living in the Arctic tundra and other icy biomes. The Arctic hare survives with shortened ears and limbs, a small nose, fat that makes up close to 20% of its body, and a thick coat of fur. It usually digs holes in the ground or under the snow to keep warm and to sleep. Arctic hares look like rabbits but have shorter ears, are taller when standing, and, unlike rabbits, can thrive in extreme cold.',
          diet: 'herbivore' 
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/animals/1')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

   
    //===============================================================================================================

    

    test('post selected animals to users zoo', async() => {

      const expectation = [
        {
          'user_id': 2,
          'animal_id': 2
        },
        {
          'user_id': 2,
          'animal_id': 6
        }
      ];


      const fakeObj = {
        user_id:2,
        animal_ids:[2, 6]
      };

      const data = await fakeRequest(app)
        .post('/api/zoos')
        .set('Authorization', token)
        .send(fakeObj)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    //===============================================================================================================

    test('get users zoo', async() => {

      const expectation = [
        
        {
          'user_id': 2,
          'animal_id': 2,
          'id': 1,
          'name': 'Arctic Fox',
          'species_name': '(Vulpes lagopus)',
          'habitat_id': 1,
          'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Iceland-1979445_%28cropped_3%29.jpg/440px-Iceland-1979445_%28cropped_3%29.jpg',
          'icon_url': 'https://cdn-icons-png.flaticon.com/128/1998/1998568.png',
          'description': 'The Arctic fox, also known as the white fox, polar fox, or snow fox, is a small fox native to the Arctic regions of the Northern Hemisphere and common throughout the Arctic tundra biome. Arctic foxes form monogamous pairs during the breeding season and they stay together to raise their young in complex underground dens. Occasionally, other family members may assist in raising their young.',
          'diet': 'omnivores',
          'habitat': 'Polar',
          'image': 'https://www.maxpixel.net/static/photo/1x/Ice-Arctic-Landscape-Scenery-Full-Moon-Nightsky-152720.png'
        },
        {
          'user_id': 2,
          'animal_id': 6,
          'id': 1,
          'name': 'Wolverine',
          'species_name': '(Gulo gulo)',
          'habitat_id': 1,
          'image_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Wolverine_on_rock.jpg/440px-Wolverine_on_rock.jpg',
          'icon_url': 'https://image.flaticon.com/icons/png/128/371/371743.png',
          'description': 'The wolverine has a reputation for ferocity and strength out of proportion to its size, with the documented ability to kill prey many times larger than itself. Wolverines live primarily in isolated arctic, boreal, and alpine regions.',
          'diet': 'omnivore',
          'habitat': 'Polar',
          'image': 'https://www.maxpixel.net/static/photo/1x/Ice-Arctic-Landscape-Scenery-Full-Moon-Nightsky-152720.png'
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/zoos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    //===============================================================================================================


    test('delete selected animals from users zoo', async() => {

      const expectation = {
        'user_id': 2,
        'animal_id': 6
      };
     

     

      const data = await fakeRequest(app)
        .delete('/api/zoos/6')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });



    //===============================================================================================================
  });
});
