const express = require('express');
const router = express.Router();

const Cart = require('../schemas/cart_schema.js'); 
const Goods = require('../schemas/goods_schema.js'); //cart에 해당하는 goods정보를 goods schema에서 가져옴

// 장바구니 목록 조회 API
// localhost:3000/api/carts GET Method
router.get('/carts', async (req, res) => {
    const carts = await Cart.find();
    // carts 안에 있는 모든 상품 정보 조회하면 {goodsId, quantity}의 형태로 조회 됨
    // [
    //  {goodsId, quantity},
    //  {goodsId, quantity},    
    // ];
    const goodsIds = carts.map((cart) => cart.goodsId);

    const goods = await Goods.find({goodsId:goodsIds});
    // Goods에 해당하는 모든 정보를 가지고 올건데,
    // 만약 goodsIds 변수 안에 존재하는 값일 때에만 조회하라.

    // 9번째 줄에서 조회한 모든 장바구니 데이터가 cart안에 담기게 됨
    const results = carts.map((cart) => {
        return {
            "quantity": cart.quantity,
            "goods": goods.find((item) => item.goodsId === cart.goodsId)
        };
    });

    res.json({
        carts: results,
    });
});

module.exports = router;

// 1. 장바구니 안에 있는 모든 데이터를 찾고
// 2. 장바구니 안에 있는 모든 상품에 대한 아이디를 찾고
// 3. 상품의 아이디를 통해서 해당 상품들에 대한 상세 정보를 가지고 오고
// 4. 상세 정보를 가지고 온 모든 상품과 첫번째로 조회한 모든 장바구니에 대한 정보 두가지를 가지고 와서
// 5. 그 중에서 장바구니에 들어있는 갯수와 그 장바구니의 goodsId가 가리키는 것의 상품 정보를
// 6. goods라는 키 에다가 넣겠다.