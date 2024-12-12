module.exports = app => {
    const orderSignal = require("../controllers/URL.controller.js");

    var router = require("express").Router();


    router.get("/", orderSignal.Check);

    router.get("/GetOrderInfo", orderSignal.GetOrderInfo);

    router.post("/AlertSignal", orderSignal.AlertSignal);

    app.use("/TV_MT_Copier", router);  ///// this is base url
};