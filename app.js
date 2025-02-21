const fs = require('fs');
const path = require("path");
const express = require('express');

const app = express();
app.set('views',path.join(__dirname,'views'));
//처리하려는 템플릿 파일의 위치를 express에게 알려주어야함
app.set('view engine','ejs');
// 두번째 인자로 해당 엔진 이름을 적는다  
app.use(express.static('public'));
app.use(express.urlencoded({
    extended : false
}));


app.get('/',function(req,res){
   res.render('index');
});

app.get('/restaurants',function(req,res){

    const filePath = path.join(__dirname,'./data/restaurants.json')
    const fileData  = fs.readFileSync(filePath)
    const storedRestaurants = JSON.parse(fileData);
    res.render('restaurants', {
        numberOfRestaurants : storedRestaurants.length,
        restaurants : storedRestaurants
    });
});

app.get('/restaurants/:id',function(req,res){
    const restaurantId = req.params.id;
    res.render('restaurants-detail',{rid : restaurantId})
    //params.뒤에 오는값은 내가 콜론뒤에 설정해준 값이름으로 
});
//:id값 형식으로 동적 라우팅

app.get('/recommend',function(req,res){
    res.render('recommend');
 });

 app.post('/recommend', function (req,res){
    const restaurant = req.body
    const filePath = path.join(__dirname,'./data/restaurants.json')
    const fileData  = fs.readFileSync(filePath)
    //동기화해서 불러온다는 개념이 중요!!
    const storedRestaurants = JSON.parse(fileData);
    //raw data를 JOSON.parse로 받아옴
    storedRestaurants.push(restaurant)
    //받아온 데이터를 restaurnt에 push 
    fs.writeFileSync(filePath,JSON.stringify(storedRestaurants))
    //JSON텍스트형식으로 변환
    res.redirect('/confirm')
    //똑같은 양식이 두번 전송되는 것을 원치 않기 때문에 리다이렉트
});

 app.get('/confirm',function(req,res){
    res.render('confirm');
 });
 app.get('/about',function(req,res){
    res.render('about');
 });
 app.get('/index',function(req,res){
    res.render('index');
 });


app.listen(3000);
