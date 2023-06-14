require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const nodemailer = require("nodemailer");

//GET ALL EMAILS
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      const userData = users.map(user => ({ email: user.email, date_created: user.created }));
      res.status(200).json({ message: userData, total: users.length });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.post("/recover", async (req, res) => {
        const transporter = nodemailer.createTransport({
            "service" : "gmail",
            "auth" : {
                "user" : process.env.MAIL,
                "pass" : process.env.PASS,
            }
        })

        const mailBody = {
            "from" : process.env.MAIL,
            "to" : req.body.email,
            "subject" : "Recuperação de palavra-passe",
            "text" : "A tua nova palavra-passe é " + req.body.pass + ". Faz login na aplicação para alterares a informação."
        }
        try {
            await transporter.sendMail(mailBody);
            res.status(200).json({ message: 'Email enviado com sucesso.' });
          } catch (error) {
            res.status(500).json({ message: err });
          }

    
})

module.exports = router;
