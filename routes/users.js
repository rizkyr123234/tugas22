var express = require('express');
var router = express.Router();

const moment = require('moment')
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
client.connect()
const dbName = 'datadb';
const db = client.db(dbName);
  const collection = db.collection('mahasiswa');

  router.get('/', function(req, res, next) {
    collection.find().toArray()
    .then(result=> res.status(200).json(result))
    .catch(error=>res.status(500).json({message:"eror ambil data"}))
  });

// =======================TAMBAH DATA======================== 
router.post('/',(req,res)=>{
  if (req.body.status == 'nikah') {
    req.body.status = true
} else { req.body.status = false }
let status = req.body.status
let berat = req.body.berat==''?'tidak diisi':parseInt(req.body.berat)
let tinggi = req.body.tinggi==''?'tidak diisi':parseFloat(req.body.tinggi)
let date = moment(req.body.date).format('YYYY MM DD')
let nama = req.body.nama
collection.insertOne({nama:nama,berat:berat,tinggi:tinggi,status:status,lahir:date})
.then(hasil=>res.status(200).json(hasil))
.catch(error=>res.status(500).json({message:"eror ambil data"}))
})
// =========================EDIT DATA=====================
router.put('/:id',(req,res)=>{
  
  let nama = req.body.nama
  let tinggi = parseFloat(req.body.tinggi)
  let date = moment(req.body.date).format('YYYY MM DD')
  let status = req.body.status
  let berat = parseInt(req.body.berat)
  if (req.body.status == 'menikah') {
      status = true
  } else { status = false }
  collection.updateMany({_id:ObjectId(req.body.id)},{$set:{nama:nama,berat:berat, tinggi:tinggi,status:status,lahir:date}})
  .then(hasil=>res.status(200).json(hasil))
  .catch(error=>res.status(500).json({message:"eror ambil data"}))
})

//=====================HAPUS DATA=====================
router.delete('/:id',(req,res)=>{
  const index =req.params.id
  collection.deleteOne({_id:ObjectId(index)})
  .then(hasil=>res.status(200).json(hasil))
  .catch(error=>res.status(500).json({message:"eror ambil data"}))
})
module.exports = router;
