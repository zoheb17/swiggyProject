import express from "express";
const router = express.Router();

import riderModel from "../../models/rider/rider.js"


router.get("/rider-details",async (req,res)=>{
    try {
        let user = req.user
        let details = await riderModel.findOne({email : user.email},{fullName:1,vehicleRc: 1,vehicleType : 1,_id : 0})

        res.status(200).json({msg : details})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})

router.put("/rider-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userinput = req.body;

    await riderModel.updateOne({ email: user.email }, { $set: userinput });
    res.status(200).json({ msg: "user update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("rider-delete", async (req, res) => {
  try {
    let user = req.user;
    await riderModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ Msg: error });
  }
});


export default router


