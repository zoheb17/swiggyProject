import express from "express";
const router = express.Router();

import restaurantModel from "../../models/restaurant/res.js";
import menuModel from "../../models/menu/menu.js";
import userModel from "../../models/user/User.js";

router.get("/res-details", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let details = await restaurantModel.findOne(
      { email: user.email },
      { fullName: 1, age: 1, _id }
    );

    res.status(200).json({ msg: details });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.put("/res-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userinput = req.body;

    await restaurantModel.updateOne({ email: user.email }, { $set: userinput });
    res.status(200).json({ msg: "user update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("res-delete", async (req, res) => {
  try {
    let user = req.user;
    await restaurantModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ Msg: error });
  }
});

router.post("/res-addmenu", async (req, res) => {
  try {
    let restaurant = await restaurantModel.findOne({ email: req.user.email });
    console.log(restaurant);
    if (!restaurant) {
      return res.status(400).json({ msg: "user not found " });
    }
    let { itemName, itemPrice, category } = req.body;

    let object = {
      restaurant_id: restaurant._id,
      itemName,
      itemPrice,
      category,
    };
    await menuModel.insertOne(object);
    res.status(200).json({ msg: "menu add" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/res-updatemenu/:_id", async (req, res) => {
  try {
    let _id = req.params._id;
    let restaurant = await restaurantModel.findOne({ email: req.user.email });
    console.log(restaurant);
    let userInput = req.body;
    console.log(userInput);
    await menuModel.updateOne(
      { restaurant_id: restaurant._id, _id: _id },
      { $set: userInput }
    );
    res.status(200).json({ msg: "menu update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/resturant-deletemenu/:_id", async (req, res) => {
  try {
    let _id = req.params._id;
    let restaurant = await restaurantModel.findOne({ email: req.user.email });

    await menuModel.deleteOne({ restaurant_id: restaurant._id, _id: _id });
    res.status(200).json({ msg: "menu delete" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});


router.get("/res-getmenu",async(req,res)=>{
try {
  let restaurant= await restaurantModel.findOne({email:req.user.email})
  let item = await menuModel.find({restaurant_id:restaurant._id},{itemName:1,itemPrice:1,category:1,_id:0})
  res.status(200).json(item)
   
} catch (error) {
  console.log(error);
  res.status(500).json({msg : error})
}
})

export default router;
