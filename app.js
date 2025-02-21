const fs = require('fs');
const path = require("path");
const express = require('express');
const uuid = require('uuid');
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
    const filePath = path.join(__dirname,'./data/restaurants.json')
    const fileData  = fs.readFileSync(filePath)
    const storedRestaurants = JSON.parse(fileData);
    
    for(const restaurant of storedRestaurants){
       if(restaurant.id === restaurantId) {
       return res.render('restaurants-detail',{restaurant : restaurant})
        //params.뒤에 오는값은 내가 콜론뒤에 설정해준 값이름으로 
        //중첩되지 않은 폴더의 경로로 되어있을 때는 css스타일의 경로를 상대적으로 지정해도
        //작동했지만 이제 아이디값이 동적으로 더 붙기떄문에 절대경로로 잡아주어야함 
    }
    //라우팅을 하고 응답해주지않으면 time out 발생
    res.status(404).render('404');
}
   
    
});
//:id값 형식으로 동적 라우팅

app.get('/recommend',function(req,res){
    res.render('recommend');
    
 });

 app.post('/recommend', function (req,res){
    const restaurant = req.body
    restaurant.id = uuid.v4();
    // 객체로 들어오는 값이 아닌 내가 임의로 지정해준 값 
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

//미들웨어 라우팅 핸들링 
app.use(function(req,res){
    res.status(404).render('404');
//url잘못 입력했을 때 에러페이지 핸들링
});

app.use(function(error, req, res, next){
    res.status(500).render('500');
    //서버측 에러 핸들링
    //개발자 도구에서 확인 할 수 있도록 상태표시
});

app.listen(3000);
