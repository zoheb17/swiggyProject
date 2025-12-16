import express from "express";
// import bcrypt from "bcrypt";
const router = express.Router();
import userModel from "../../models/user/User.js";
router.get("/user-details", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let details = await userModel.findOne(
      { email: user.email },
      { fullName: 1, age: 1, _id:0 }
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
    res.status(200).json({msg : "user deleted sucessfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ Msg: error });
  }
});

export default router;
