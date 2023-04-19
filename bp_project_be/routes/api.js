var express = require('express');
var router = express.Router();
const {db} = require('../db');
/* const { findOneListingByTipo } = require('../db'); */
const { client } = require('../db');


router.get("/buoni/:utente", async (req, res) => {

  console.log(req.params);
  const connection = await client.connect();
  const dbTable = connection.db('datisede'); 
  const data = await dbTable.collection('buonipasto').find({utente: req.params.utente}).toArray();
  data ? res.status(200).send(data) : res.status(404).send('Buono non trovato');
   
});

router.get('/getAll', async (req, res) => {

  try {
    const connection = await client.connect();
    const dbTable = connection.db('datisede')
    const data = await dbTable.collection('buonipasto').find({}).toArray();
    return res.send(data).status(200);

  } catch (error) {
    res.status(500).json({message: error.message});
  }
  
})

router.post('/send', async (req, res) => {
  console.log(req)

  const connection = await client.connect();
  const dbTable = connection.db('datisede');
  const data = await dbTable.collection('buonipasto').find({utente: req.body.utente}).toArray();
  data ? res.send(data).status(200) : res.status(404).send('Buono non trovato');
})

router.post('/save-buono', async (req, res) => {

  console.log(req.body);
  const connection = await client.connect();
  const dbTable = connection.db('datisede');
  const data = await dbTable.collection('buonipasto').insertOne({utente: req.body.utente, tipo: req.body.tipo, datautilizzo: req.body.datautilizzo});
  data ? res.send(data).status(200) : res.status(404).send('Buono non trovato');

})

module.exports = router;