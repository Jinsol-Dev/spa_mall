// /routes/goods.js
const express = require("express");
const router = express.Router();

const Goods = require("../schemas/goods_schema.js");  //TDZ
const Cart = require("../schemas/cart_schema.js");


// 상품 상세 조회 API
router.get("/goods/:goodsId", (req, res) => {
  const {goodsId} = req.params;
  const {detail} = Goods.find((goods) => goods.goodsId === Number(goodsId)); //forEach, map, filter, find
  res.json({detail});
});


// 장바구니에 상품 추가 API
router.post("/goods/:goodsId/cart", async(req, res) => {
  // 객체 형태로 데이터가 전달되기 때문에 구조분해할당 형태 입력
  const {goodsId} = req.params;
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId});
  if (existsCarts.length){
    return res.status(400).json({
      success:false, 
      errorMessage:"이미 장바구니에 해당하는 상품이 존재합니다."
    });
   }
   await Cart.create({goodsId, quantity});

   res.json({result:"success"});
});


// 상품 등록 API
router.post("/goods", async (req, res) => {
	const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ 
      success: false, 
      errorMessage: "이미 존재하는 GoodsId 입니다." 
    });
  };

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});


// 장바구니에 담긴 상품 수량 수정 API
router.put("/goods/goodsId/cart", async (req, res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;

  const existsCarts = await Cart.find({goodsId});
  if(existsCarts.length){
    await Cart.updateOne(
      {goodsId:goodsId},           //goodsId에 해당하는 값이 있을 때
      {$set: {quantity:quantity}}  //quantity를 quantity 변수에 있는 값으로 수정한다(57번째 줄)
    )
  }
  res.status(200).json({success:true}) //값이 있든 없든 success:true에 걸린다 > 장바구니에 값이 없더라도 에러가 발생하지 않는다. 
})


// 장바구니 상품 제거 API
router.delete("/goods/goodsId/cart", async (req, res) => {
  const {goodsId} = req.params;
  
  const existsCarts = await Cart.find({goodsIds});
  if(existsCarts.length){
    await Cart.deleteOne({goodsId});
  }

  res.json({resutl:"success"});
})

// 상품을 담을 장바구니 만들기 API
router.post('/goods/:goodsId/cart')


module.exports = router;