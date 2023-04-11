module.exports = app => {
    const orderSignal = require("../controllers/URL.controller.js");

    var router = require("express").Router();

    // Retrieve all orderSignal
    router.get("/", orderSignal.Check);

    // Retrieve all published orderSignal
    router.post("/Login", orderSignal.Login);

    // router.post("/OpenOrder", orderSignal.OpenOrder);

    // router.post("/CloseOrder", orderSignal.CloseOrder);

    router.get("/GetOrderInfo", orderSignal.GetOrderInfo);

    router.get("/History", orderSignal.History);

    router.post("/TVOpenSignal", orderSignal.TVOpenSignal);

    router.post("/HistoryClear", orderSignal.HistoryClear);


    app.use("/RemoteCopier", router);  ///// this is base url
};