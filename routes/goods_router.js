// /routes/goods.js ( + 에러처리)

const express = require("express");
const router = express.Router();

const Goods = require("../schemas/goods_schema.js");  
const Cart = require("../schemas/cart_schema.js");


// 상품 상세 조회 API
router.get("/goods/:goodsId", (req, res, next) => {
  try {
  const {goodsId} = req.params;
  const {detail} = Goods.find((goods) => goods.goodsId === Number(goodsId)); 
  res.json({detail});
  
  } catch (error) {
    next(error) 
  };

});


// 장바구니에 상품 추가 API
router.post("/goods/:goodsId/cart", async(req, res, next) => {
  try {
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

   } catch (error) {
      next(error)
   };
});


// 상품 등록 API
router.post("/goods", async (req, res, next) => {
  try {
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
  }catch(error){
   next(error)
  };
});


// 장바구니에 담긴 상품 수량 수정 API
router.put("/goods/goodsId/cart", async (req, res, next) => {
  try {
    const {goodsId} = req.params;
    const {quantity} = req.body;

    const existsCarts = await Cart.find({goodsId});
    if(existsCarts.length){
      await Cart.updateOne(
        {goodsId:goodsId},
        {$set: {quantity:quantity}}
      )
    } 
    res.status(200).json({success:true})
  }catch(error){
    next(error)
  };
});


// 장바구니 상품 제거 API
router.delete("/goods/goodsId/cart", async (req, res) => {
  try {
  const {goodsId} = req.params;
  
  const existsCarts = await Cart.find({goodsIds});
  if(existsCarts.length){
    await Cart.deleteOne({goodsId});
  }

  res.json({resutl:"success"});
  }catch(error){
    next(error)
  }; 
});



module.exports = router;