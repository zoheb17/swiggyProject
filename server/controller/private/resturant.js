import express from "express";
const router = express.Router();

import restaurantModel from "../../models/restaurant/res.js";


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

router.post("/res-addmenu",async(req,res)=>{
    try {
        let user=req.user;
        let userInput=req.body;
        console.log(userInput);
        await restaurantModel.updateOne({email:user.email},{$push:{menu:userInput}})
        res.status(200).json({msg:`${userInput.itemName} add to menu`})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
})

export default router