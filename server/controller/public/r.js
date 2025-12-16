import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import riderModel from "../../models/rider/rider.js";

import sendmail from "../../utlis/miller.js";
import sendSMS from "../../utlis/sms.js";

const router = express.Router();

router.post("/rider-register", async (req, res) => {
  try {
    let {fullName, email,vechicleRc,vechicleType,gender, phone,password ,age}=req.body
    let user = await riderModel.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(404).json({ msg: "user already exist" });
    }
    let hashPass = await bcrypt.hash(password, 10);

    let emailToken = Math.random().toString(36).slice(2, 10);
    let phoneToken = Math.random().toString(36).slice(2, 10);

    let finalDbobject = {
      fullName,
      email,
      vechicleRc,
      vechicleType,
      age,
      gender,
      phone,
      password: hashPass,
      isVerifiedToken: {
        email: emailToken,
        phone: phoneToken,
      },
    };
    await riderModel.create(finalDbobject);
    let emailurl = `http://localhost:5000/users/verify-email/${emailToken}`;
    let phoneurl = `http://localhost:5000/users/verify-email/${phoneToken}`;
    console.log(emailurl);
    console.log(phoneToken);
    await sendmail(
      email,
      `welcome to swiggy app`,
      "verification link",
      `please verify link ${email}`
    );

    await sendSMS(phone, `pleasse click the link below ${phoneurl}`);

    res.status(201).json({ msg: `Account register  sucessfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.get("/verify-email/:emailToken", async (req, res) => {
  try {
    let emailToken = req.params.emailToken;

    if (!emailToken) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await riderModel.findOne({
      "isVerifiedToken.email": emailToken,
    });
    if (!user) {
      res.status(400).json({ msg: "invalid token or no rider  found" });
    }
    user.isVerified.email = true;
    user.isVerifiedToken.email = null;
    await user.save();
    res.status(200).json({ msg: "email registered done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.get("/verify-phone/:phoneToken", async (req, res) => {
  try {
    let phoneToken = req.params.phoneToken;

    if (!phoneToken) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await riderModel.findOne({
      "isVerifiedToken.phone": phoneToken,
    });
    if (!user) {
      res.status(400).json({ msg: "invalid token or no rider  found" });
    }
    user.isVerified.phone = true;
    user.isVerifiedToken.phone = null;
    await user.save();
    res.status(200).json({ msg: "phone registered done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await riderModel.findOne({ email });
    if(!user.isOnline){
        return res.status(400).json({msg:"account delete"})
    }
    let hashPass = await bcrypt.compare(password, user.password);
    if (!hashPass) {
      return res.status(404).json({ msg: "user not  found " });
    }
    let playload = {
      email: user.email,
      id: user._id,
    };
    let token = await jwt.sign(playload, process.env.SECKEY);
    res.status(200).json({ msg: "login done ", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

export default router;
