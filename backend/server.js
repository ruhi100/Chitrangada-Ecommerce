const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* -------------------------
   CREATE ORDER (Frontend)
--------------------------*/
app.post("/create-order", (req,res)=>{

    const { name, phone, product, amount } = req.body;

    const sql = "INSERT INTO orders (name, phone, product, amount) VALUES (?,?,?,?)";

    db.query(sql, [name, phone, product, amount], (err,result)=>{
        if(err){
            return res.status(500).json(err);
        }

        res.json({
            success:true,
            orderId: result.insertId
        });
    });
});

/* -------------------------
   PAYMENT SUCCESS UPDATE
--------------------------*/
app.post("/payment-success", (req,res)=>{

    const { orderId } = req.body;

    const sql = "UPDATE orders SET payment_status='PAID' WHERE id=?";

    db.query(sql, [orderId], (err,result)=>{
        if(err){
            return res.status(500).json(err);
        }

        res.json({
            success:true,
            message:"Order Paid & Confirmed"
        });
    });
});

/* -------------------------
   GET ALL ORDERS (ADMIN)
--------------------------*/
app.get("/orders", (req,res)=>{

    db.query("SELECT * FROM orders ORDER BY id DESC", (err,result)=>{
        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

app.listen(process.env.PORT, ()=>{
    console.log("Server running on port", process.env.PORT);
});