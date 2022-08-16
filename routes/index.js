var express = require('express');
var router = express.Router();
const moment = require('moment');
var client = require('../db')
const dbName = 'datadb';
const db = client.client.db(dbName);
  const collection = db.collection('mahasiswa');
  
router.get('/', function(req, res, next) {

  const url = req.url == '/' ? '/?page=1&orderBy=nama&mode=1' :req.url
  const limit = 3
  const page = req.query.page ||1
  const offset = (page-1)*limit
  
  // ================================SORTING==========================================

  let order 
  let mode = req.query.mode || '1'
  
  if(req.query.orderBy == 'nama'){
    order = {nama:mode}
  } else if(req.query.orderBy=='berat'){
    order = {berat : mode}
  } else if(req.query.orderBy=='tinggi'){
    order = {tinggi : mode}
  } else if(req.query.orderBy=='lahir'){
    order={lahir:mode}
  }

  // ============================SEARCHING===============================================

  let status1 
  let tinggi1 
  let berat1
  let nama
  let date1 
  let date2
  let jumlahDate
  
  if(req.query.nama){
   nama = {nama:{$regex:`${req.query.nama}`}}
  }
  if(req.query.berat){
    let berat = parseInt(req.query.berat)
     berat1 = {berat:berat}
  }
  if(req.query.tinggi){
    let tinggi = parseFloat(req.query.tinggi)
    tinggi1 = {tinggi:tinggi}
  }
  if(req.query.status&& req.query.status !='pilih'){
    let status = req.query.status
    console.log(req.query.status == 'nikah')
    if (req.query.status == 'nikah') {
      status = true
  } else { status = false }
 status1 = {status:status}
  }
  if(req.query.date && req.query.date2 ){
    date1 = req.query.date
    date2 = req.query.date2
    jumlahDate={lahir:{$gte:(date1),$lt:(date2)}}
  }
 else if(req.query.date){
  date1={lahir:{$gte:(req.query.date)}}
 }
 else if (req.query.date2){
  date2={lahir:{$lt:(req.query.date2)}}
 }

 let jumlah ={...nama,...berat1,...tinggi1,...status1,...date1,...date2,...jumlahDate}
 
collection.count(jumlah)
.then(hitung=>Math.ceil(hitung/limit))
.then(pages=>collection.find(jumlah).limit(limit).skip(offset).sort(order).toArray()
.then(result=> res.render('menu',{rows:result,moment,pages,page,url,query:req.query
})))
});
//============================TAMBAH===============================================
router.get('/tambah',(req,res)=>{
  res.render('tambah')
})

router.post('/tambah',(req,res)=>{
  if (req.body.status == 'nikah') {
    req.body.status = true
} else { req.body.status = false }
let status = req.body.status
let berat = req.body.berat==''?'tidak diisi':parseInt(req.body.berat)
let tinggi = req.body.tinggi==''?'tidak diisi':parseFloat(req.body.tinggi)
let date = req.body.date==''?'tidak diisi':req.body.date
let nama = req.body.nama
collection.insertOne({nama:nama,berat:berat,tinggi:tinggi,status:status,lahir:date})
res.redirect('/')
})

//============================DELETE===============================================
router.get('/delet/:id',(req,res)=>{
  const index =req.params.id
  collection.deleteOne({_id:client.ObjectId(index)})
  res.redirect('/')
})

//============================EDIT===============================================
router.get('/edit/:id',(req,res)=>{
  collection.find({_id:client.ObjectId(req.params.id)}).toArray()
  .then(hasil=>res.render('edit',{item:hasil[0],moment}))
})

router.post('/edit/:id',(req,res)=>{
  
  let nama = req.body.nama
  let tinggi = parseFloat(req.body.tinggi)
  let date = moment(req.body.date).format('YYYY MM DD')
  let status = req.body.status
  let berat = parseInt(req.body.berat)
  if (req.body.status == 'menikah') {
      status = true
  } else { status = false }
  collection.updateMany({_id:client.ObjectId(req.body.id)},{$set:{nama:nama,berat:berat, tinggi:tinggi,status:status,lahir:date}})
  res.redirect('/')
})


module.exports = router;
