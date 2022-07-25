var express = require('express');
var router = express.Router();
const moment = require('moment')
const { MongoClient, ObjectId } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
client.connect()
const dbName = 'datadb';
const db = client.db(dbName);
  const collection = db.collection('mahasiswa');
// Database Name
router.get('/', function(req, res, next) {
collection.find({}).toArray()
.then(hasil=>res.render('menu',{rows:hasil,moment}))
});
//tambah
router.get('/tambah',(req,res)=>{
  res.render('tambah')
})

router.post('/tambah',(req,res)=>{
  if (req.body.status == 'nikah') {
    req.body.status = true
} else { req.body.status = false }
let status = req.body.status
let berat = parseInt(req.body.berat)
let tinggi = parseInt(req.body.tinggi)
let date = req.body.date
let nama = req.body.nama
collection.insertOne({nama:nama,berat:berat,tinggi:tinggi,status:status,lahir:date})
res.redirect('/')
})

//delete
router.get('/delet/:id',(req,res)=>{
  const index =req.params.id
  collection.deleteOne({_id:ObjectId(index)})
  res.redirect('/')
})

//edit
router.get('/edit/:id',(req,res)=>{
  collection.find({_id:ObjectId(req.params.id)}).toArray()
  .then(hasil=>res.render('edit',{item:hasil[0]}))
})

router.post('/edit/:id',(req,res)=>{
  
  let nama = req.body.nama
  let tinggi = parseInt(req.body.tinggi)
  let date = req.body.date
  let status = req.body.status
  let berat = parseInt(req.body.berat)
  if (req.body.status == 'menikah') {
      status = true
  } else { status = false }
  collection.updateMany({_id:ObjectId(req.body.id)},{$set:{nama:nama,berat:berat, tinggi:tinggi,status:status,date:date}})
  res.redirect('/')
})
/* GET home page. */


module.exports = router;
