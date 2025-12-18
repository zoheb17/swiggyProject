import express from "express";
// import bcrypt from "bcrypt";
const router = express.Router();
import userModel from "../../models/user/User.js";
// import { QueryInstance } from "twilio/lib/rest/lookups/v2/query.js";
import menuModel from "../../models/menu/menu.js";
import restaurantModel from "../../models/restaurant/res.js";
import riderModel from "../../models/rider/rider.js";
import salesModule from "../../models/sales/sales.js";

router.get("/user-details", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let details = await userModel.findOne(
      { email: user.email },
      { fullName: 1, age: 1, _id: 0 }
    );

    res.status(200).json({ msg: details });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.put("/user-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userinput = req.body;

    await userModel.updateOne({ email: user.email }, { $set: userinput });
    res.status(200).json({ msg: "user update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/user-delete", async (req, res) => {
  try {
    let user = req.user;
    await userModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "user deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Msg: error });
  }
});

router.post("/place-order", async (req, res) => {
  try {
    let { itemName, itemQty, method, restaurant } = req.body;
    let resta = await restaurantModel.findOne(
      { restaurantName: restaurant, isOpen: true },
      { _id: 1 }
    );
    if (!resta) {
      return res
        .status(400)
        .json({ msg: "yor seleected  restaurant is not aviable" });
    }
    let itemAvail = await menuModel.findOne({
      restaurant_id: resta._id,
      itemName,
    });
    if (!itemAvail) {
      return res
        .status(400)
        .json({ msg: "your selected dish is not aviable at " });
    }
    let rider = await riderModel({ isOnline: true });
    if(!rider){
      return res.status(404).json({msg:"please wait for sometime"})
    }

    let salesplayload = {
      userId: req.user.id,
      rider_id: rider._id,
      restaurantId: resta._id,
      orderDetails: {
        itemQty,
        itemName,
        itemPrice: itemAvail.price,
        total: itemAvail.itemPrice * itemQty,
        paymentMethod: method,
      },
    };
    await salesModule.insertOne(salesplayload);
    res.status(200).json({ msg: "order placed" });

    console.log(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/get-res-with-food", async (req, res) => {
  try {
    const { itemName } = req.body;
    const menus = await menuModel.find({ itemName });
    console.log(menus);
    const ids = menus.map((m) => m.restaurant_id);
console.log(ids);
    const restaurants = await restaurantModel.find(
      { _id: { $in: ids } },
      { restaurantName: 1, _id: 0 }
    );

    res.json(restaurants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;
