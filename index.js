const express=require('express');
const app = express();
app.use(express.urlencoded({extended: true})) 
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true})) 
var db;

const MongoClient = require('mongodb').MongoClient//mongodb
app.set('view engine', 'ejs');
//수정하기
MongoClient.connect("mongodb+srv://weseonggu:tjd9343750@cluster0.dhtqz03.mongodb.net/?retryWrites=true&w=majority", function(err, client){
    if (err) return console.log(err)
        db = client.db('surakmoon');
  
        console.log('DB connected');
  
    app.listen(5050, function() {
        console.log('listening on 5050');
    })
})

app.use(express.static('res'));


app.get("/",function(req,res){
    res.sendFile(__dirname+'/index.html');
})

app.get("/hiking",function(req,res){
    res.sendFile(__dirname+'/hiking.html');
})

app.get("/restaurant",function(req,res){
    res.sendFile(__dirname+'/restaurant.html');
})

app.get("/book",function(req,res){
    res.sendFile(__dirname+'/book.html');
})

app.get('/park',function(req,res){
    db.collection('valet').find().toArray(function(err, result){
        console.log(result);
        res.render('park.ejs', {use : result});
    })
})

// 주차요원
app.get('/valet', function(req, res) { 
  res.sendFile(__dirname +'/valet.html')
})
//주차 관리 페이지
  app.post('/add', function(req, res){
    db.collection('valet').findOne({name : 'parking'}, function(err, result){
      var mycount = result.count;
      if (mycount>0){
            db.collection('valet').updateOne({name:'parking'},{ $inc: {count:-1} },function(err, result){
            if (err) return console.log(err)
            console.log('save complete')
            res.sendFile(__dirname+'/backPage.html')
        });  
      }
      else{
        res.sendFile(__dirname+'/backPage.html')
      }

    });
  });
  app.post('/sub', function(req, res){
    db.collection('valet').findOne({name : 'parking'}, function(err, result){
      var mycount = result.count;
      if (mycount<40){
            db.collection('valet').updateOne({name:'parking'},{ $inc: {count:1} },function(err, result){
            if (err) return console.log(err)
            console.log('save complete')
            res.sendFile(__dirname+'/backPage.html')
        });  
      }
      else{
        res.sendFile(__dirname+'/backPage.html')
      }

    });
  });

//생선 구이집
app.get('/fish', function(req, res) {
  db.collection('fish').find().toArray(function(err, result){
    var sum=0;
    var avg=0;
    for(var i =0; i<result.length;i++){
      sum+=parseInt(result[i].score);
    }
    avg=(sum/result.length).toFixed(1);
    res.render('fish.ejs', {review : result, avgdata : avg});
  })
})

app.post('/fish-review',function(req,res){
  db.collection('fish').insertOne({score : req.body.score, text : req.body.reviewText},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

//쿠마키친
app.get('/dongas', function(req, res) {
  db.collection('dongas').find().toArray(function(err, result){
    var sum=0;
    var avg=0;
    for(var i =0; i<result.length;i++){
      sum+=parseInt(result[i].score);
    }
    avg=(sum/result.length).toFixed(1);
    res.render('dongas.ejs', {review : result, avgdata : avg});
  })
})

app.post('/dongas-review',function(req,res){
  db.collection('dongas').insertOne({score : req.body.score, text : req.body.reviewText},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

//팔선당
app.get('/palsundang', function(req, res) {
  db.collection('palsundang').find().toArray(function(err, result){
    var sum=0;
    var avg=0;
    for(var i =0; i<result.length;i++){
      sum+=parseInt(result[i].score);
    }
    avg=(sum/result.length).toFixed(1);
    res.render('palsundang.ejs', {review : result, avgdata : avg});
  })
})

app.post('/palsundang-review',function(req,res){
  db.collection('palsundang').insertOne({score : req.body.score, text : req.body.reviewText},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

//설빙
app.get('/snow', function(req, res) {
  db.collection('snow').find().toArray(function(err, result){
    var sum=0;
    var avg=0;
    for(var i =0; i<result.length;i++){
      sum+=parseInt(result[i].score);
    }
    avg=(sum/result.length).toFixed(1);
    res.render('snow.ejs', {review : result, avgdata : avg});
  })
})

app.post('/snow-review',function(req,res){
  db.collection('snow').insertOne({score : req.body.score, text : req.body.reviewText},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

//수제비
app.get('/sukaebi', function(req, res) {
  db.collection('sukaebi').find().toArray(function(err, result){
    var sum=0;
    var avg=0;
    for(var i =0; i<result.length;i++){
      sum+=parseInt(result[i].score);
    }
    avg=(sum/result.length).toFixed(1);
    res.render('sukaebi.ejs', {review : result, avgdata : avg});
  })
})

app.post('/sukaebi-review',function(req,res){
  db.collection('sukaebi').insertOne({score : req.body.score, text : req.body.reviewText},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});




// 생선 예약서비스
app.post('/fish-book',function(req,res){
  db.collection('book').insertOne({ restaurant : "fish", name : req.body.name, phone_number : req.body.phone_number, time : req.body.book_time, yesno : "no"},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

app.get('/fish_book', function(req, res) {
  db.collection('book').find({yesno : "yes", restaurant:"fish"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    res.render('fish_book.ejs', {booker:result});
  })
})



//생선 식당주인 페이지
app.get('/fish_own', function(req, res) {
  db.collection('book').find({restaurant:"fish"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    var no=[];
    var yes=[];
    // console.log(result)
    for(var i=0; i<result.length;i++){
      if(result[i].yesno =='no'){
        no.push(result[i])
      }
      else if (result[i].yesno =='yes'){
        yes.push(result[i])
      }
    }
    res.render('fish_own.ejs', {yes : yes, no : no});
  })
})
//수락
app.post('/fish-ok',function(req,res){
  db.collection('book').updateMany({name : req.body.name, restaurant:"fish", yesno:"no"},{ $set: {yesno:"yes"} },function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//취소
app.post('/fish-cancle',function(req,res){
  db.collection('book').deleteMany({name : req.body.name, restaurant:"fish"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//가계 닫음
app.post('/fish-close',function(req,res){
  db.collection('book').deleteMany({restaurant:"fish"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});

// 쿠마키친 예약서비스
app.post('/dongas-book',function(req,res){
  db.collection('book').insertOne({ restaurant : "dongas", name : req.body.name, phone_number : req.body.phone_number, time : req.body.book_time, yesno : "no"},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

app.get('/dongas_book', function(req, res) {
  db.collection('book').find({yesno : "yes", restaurant:"dongas"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    res.render('dongas_book.ejs', {booker:result});
  })
})


//쿠마키친 식당주인 페이지
app.get('/dongas_own', function(req, res) {
  db.collection('book').find({restaurant:"dongas"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    var no=[];
    var yes=[];
    // console.log(result)
    for(var i=0; i<result.length;i++){
      if(result[i].yesno =='no'){
        no.push(result[i])
      }
      else if (result[i].yesno =='yes'){
        yes.push(result[i])
      }
    }
    res.render('dongas_own.ejs', {yes : yes, no : no});
  })
})
//수락
app.post('/dongas-ok',function(req,res){
  db.collection('book').updateMany({name : req.body.name, restaurant:"dongas", yesno:"no"},{ $set: {yesno:"yes"} },function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//취소
app.post('/dongas-cancle',function(req,res){
  db.collection('book').deleteMany({name : req.body.name, restaurant:"dongas"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//가계 닫음
app.post('/dongas-close',function(req,res){
  db.collection('book').deleteMany({restaurant:"dongas"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});




// 팔선당 예약서비스
app.post('/palsundang-book',function(req,res){
  db.collection('book').insertOne({ restaurant : "palsundang", name : req.body.name, phone_number : req.body.phone_number, time : req.body.book_time, yesno : "no"},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

app.get('/palsundang_book', function(req, res) {
  db.collection('book').find({yesno : "yes", restaurant:"palsundang"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    res.render('palsundang_book.ejs', {booker:result});
  })
})


//팔선당 식당주인 페이지
app.get('/palsundang_own', function(req, res) {
  db.collection('book').find({restaurant:"palsundang"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    var no=[];
    var yes=[];
    // console.log(result)
    for(var i=0; i<result.length;i++){
      if(result[i].yesno =='no'){
        no.push(result[i])
      }
      else if (result[i].yesno =='yes'){
        yes.push(result[i])
      }
    }
    res.render('palsundang_own.ejs', {yes : yes, no : no});
  })
})
//수락
app.post('/palsundang-ok',function(req,res){
  db.collection('book').updateMany({name : req.body.name, restaurant:"palsundang", yesno:"no"},{ $set: {yesno:"yes"} },function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//취소
app.post('/palsundang-cancle',function(req,res){
  db.collection('book').deleteMany({name : req.body.name, restaurant:"palsundang"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//가계 닫음
app.post('/palsundang-close',function(req,res){
  db.collection('book').deleteMany({restaurant:"palsundang"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});



// 설빙 예약서비스
app.post('/snow-book',function(req,res){
  db.collection('book').insertOne({ restaurant : "snow", name : req.body.name, phone_number : req.body.phone_number, time : req.body.book_time, yesno : "no"},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

app.get('/snow_book', function(req, res) {
  db.collection('book').find({yesno : "yes", restaurant:"snow"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    res.render('snow_book.ejs', {booker:result});
  })
})


//설빙 식당주인 페이지
app.get('/snow_own', function(req, res) {
  db.collection('book').find({restaurant:"snow"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    var no=[];
    var yes=[];
    // console.log(result)
    for(var i=0; i<result.length;i++){
      if(result[i].yesno =='no'){
        no.push(result[i])
      }
      else if (result[i].yesno =='yes'){
        yes.push(result[i])
      }
    }
    res.render('snow_own.ejs', {yes : yes, no : no});
  })
})
//수락
app.post('/snow-ok',function(req,res){
  db.collection('book').updateMany({name : req.body.name, restaurant:"snow", yesno:"no"},{ $set: {yesno:"yes"} },function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//취소
app.post('/snow-cancle',function(req,res){
  db.collection('book').deleteMany({name : req.body.name, restaurant:"snow"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//가계 닫음
app.post('/snow-close',function(req,res){
  db.collection('book').deleteMany({restaurant:"snow"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});




// 수제비 예약서비스
app.post('/sukaebi-book',function(req,res){
  db.collection('book').insertOne({ restaurant : "sukaebi", name : req.body.name, phone_number : req.body.phone_number, time : req.body.book_time, yesno : "no"},function(err){
    if (err) return console.log(err)
    console.log('save complete')
    res.sendFile(__dirname+'/backPage.html')
  });
});

app.get('/sukaebi_book', function(req, res) {
  db.collection('book').find({yesno : "yes", restaurant:"sukaebi"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    res.render('sukaebi_book.ejs', {booker:result});
  })
})


//수제비 식당주인 페이지
app.get('/sukaebi_own', function(req, res) {
  db.collection('book').find({restaurant:"sukaebi"}).toArray(function(err, result){//no나중에 yes로 바꾸기
    var no=[];
    var yes=[];
    // console.log(result)
    for(var i=0; i<result.length;i++){
      if(result[i].yesno =='no'){
        no.push(result[i])
      }
      else if (result[i].yesno =='yes'){
        yes.push(result[i])
      }
    }
    res.render('sukaebi_own.ejs', {yes : yes, no : no});
  })
})
//수락
app.post('/sukaebi-ok',function(req,res){
  db.collection('book').updateMany({name : req.body.name, restaurant:"sukaebi", yesno:"no"},{ $set: {yesno:"yes"} },function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//취소
app.post('/sukaebi-cancle',function(req,res){
  db.collection('book').deleteMany({name : req.body.name, restaurant:"sukaebi"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});
//가계 닫음
app.post('/sukaebi-close',function(req,res){
  db.collection('book').deleteMany({restaurant:"sukaebi"},function(err,result){
    if (err) return console.log(err)
    res.sendFile(__dirname+'/backPage.html')
  });
});

