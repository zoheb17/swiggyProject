import express from "express";
import bcrypt from "bcrypt";
import userModel from "../../models/user/User.js";
import sendmail from "../../utlis/miller.js";
import sendSMS from "../../utlis/sms.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { fullName, email, age, password, gender, phone } = req.body;
    let user = await userModel.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(404).json({ msg: "user already exist" });
    }
    let hashPass = await bcrypt.hash(password, 10);

    let emailToken = Math.random().toString(36).slice(2, 10);
    let phoneToken = Math.random().toString(36).slice(2, 10);

    let finalDbobject = {
      fullName,
      email,
      age,
      gender,
      phone,
      password: hashPass,
      isVerifiedToken: {
        email: emailToken,
        phone: phoneToken,
      },
    };
    await userModel.create(finalDbobject);
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
    let user = await userModel.findOne({ "isVerifiedToken.email": emailToken });
    if (!user) {
      res.status(400).json({ msg: "invalid token or no user found" });
    }
    user.isVerified.email = true;
    user.isVerifiedToken.email = null;
    await user.save();
    res.status(200).json({ msg: "email registered dsone" });
  } catch (error) {}
});

router.get("/verify-phone/:phoneToken", async (req, res) => {
  try {
    let phoneToken = req.params.phoneToken;

    if (!phoneToken) {
      return res.status(400).json({ msg: "no token" });
    }
    let user = await userModel.findOne({ "isVerifiedToken.phone": phoneToken });
    if (!user) {
      res.status(400).json({ msg: "invalid token or no user found" });
    }
    user.isVerified.phone = true;
    user.isVerifiedToken.phone = null;
    await user.save();
    res.status(200).json({ msg: "phone registered done" });
  } catch (error) {}
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if(!user.isActive){
        return res.status(400).json({msg:"account delete"})
    }
    let hashPass = await bcrypt.compare(password, user.password);
    if (!hashPass) {
      return res.status(404).json({ msg: "user not  found " });
    }

    let playload = {
      email,
      id: user._id,
    };
    let token = await jwt.sign(playload, process.env.SECKEY);
    res.status(200).json({ msg: "login done ", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/forgotpass", async (req, res) => {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json("user not found");
    }
    let otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
    let otpurl = `http://localhost:5000/public/setnewpassword`;
    await sendmail(
      email,
      "otp for changing password",
      `enter this otp to change \notp ${otp}\n visite this site${otpurl}`
    );
    await userModel.updateOne({ email }, { $set: { otp } });
    res.status(200).json({ msg: "otp sent to your register email" });
  } catch (error) {}
});

router.post("/change-password", async (req, res) => {
  try {
    let { email, otp, password } = req.body;
    let user = await userModel.findOne({ $and: [{ email }, { otp }] });
    if (!user) return res.status(400).json({ msg: "Invalid OTP or User" });
    let pass = await bcrypt.hash(password, 10);
    await userModel.updateOne(
      {email:user.email},
      { $set: { password: pass }, $unset: { otp: "" } }
    );
    res.status(200).json({ msg: "Password changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
export default router;
