const express = require('express');
const app = express();   
const port = 3000;


const goodsRouter = require('./routes/goods_router');
const cartsRouter = require('./routes/carts_router');


//body-parser를 쓰기 위한 문법
//body-parser를 이용해서 req.body에 들어와있는 데이터를 json 형식으로 볼 것이다.  
app.use(express.json());  


//이곳에 mongodb 사이트에서 카피한 주소를 이곳에 넣으면 된다.
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
  .connect(
    'mongodb+srv://test:sparta@cluster0.lwbd7w1.mongodb.net/?retryWrites=true&w=majority',
    {
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.log(err);
  });


// localhost:3000/api -> goodsRouter
// 2번째 줄과 연관
app.use('/api', goodsRouter);
app.use('/api', cartsRouter);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});