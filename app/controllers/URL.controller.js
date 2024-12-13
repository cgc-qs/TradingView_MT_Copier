let PENDING = "PENDING";
let MARKET = "MARKET";
let COMMAND = "COMMAND";
let Alerts = [];

const GetDateText = () => {
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    const date_time = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    return date_time;
}



const GetSpecifiedAlert = (License_ID = "", command = "", symbol = "", type = "") => {

    let orders = [];

    for (let i = 0; i < Alerts.length; i++) {
        let element = Alerts[i];
        if (License_ID != "" && element.License_ID != License_ID)
            continue;
        if (command != "" && element.command != command)
            continue;
        if (symbol != "" && element.symbol != symbol)
            continue;
        if (type != "" && element.type != type)
            continue;
        orders.push(element);
        // console.log(element);
    }
    return orders;
}


const RemoveSpecifiedAlert = (License_ID, symbol = "") => {

    if (License_ID == "all") {
        Alerts = [];
        return;
    }
    else {
        let orders = [];
        for (let i = 0; i < Alerts.length; i++) {
            let element = Alerts[i];
            if (element.License_ID == License_ID && (symbol == "" || element.symbol == symbol))
                continue;

            orders.push(element);
            // console.log(element);
        }
        Alerts = orders.slice();
    }
}

const Converting_Alert = (text) => {

    const separatedValues = text.split(',');
    let result = {};
    result.License_ID = "";
    result.command = "";
    result.symbol = "";
    result.price = "";
    result.lotsize = "";
    result.type = "";
    result.time = GetDateText();
    result.ticket = new Date().getTime() - new Date("2024-12-01").getTime();

    if (separatedValues.length >= 5)
        result.price = separatedValues[4].trim();
    if (separatedValues.length >= 4)
        result.lotsize = separatedValues[3].trim();
    if (separatedValues.length >= 3)
        result.symbol = separatedValues[2].trim();
    if (separatedValues.length >= 2)
        result.command = (separatedValues[1].trim()).toLowerCase();
    if (separatedValues.length >= 1)
        result.License_ID = separatedValues[0].trim();
    if (result.command != "") {
        if (result.command == "buylimit" || result.command == "selllimit" || result.command == "buystop" || result.command == "sellstop")
            result.type = PENDING;
        else if (result.command == "buy" || result.command == "sell")
            result.type = MARKET;
        else
            result.type = COMMAND;
    }
    return result;
}


exports.Check = async (req, res) => {
    res.status(200).send({ message: "OK" });
};


exports.AlertSignal = async (req, res) => {
    try {
        console.log("original Signal: ", req.body);
        let convertedSig = Converting_Alert(req.body);
        console.log("converted Signal: ", convertedSig);

        let existMarketOrders = GetSpecifiedAlert(convertedSig.License_ID, "", convertedSig.symbol, MARKET);
        let existSameInfos = GetSpecifiedAlert(convertedSig.License_ID, convertedSig.command, convertedSig.symbol, "");
        // Remove old Market order
        if (convertedSig.type == MARKET && existMarketOrders.length > 0) {
            const filteredArray = Alerts.filter(item => item !== existMarketOrders[0]);
            Alerts = filteredArray;
        }
        // Remove old same info
        if (convertedSig.type != MARKET && existSameInfos.length > 0) {
            const filteredArray = Alerts.filter(item => item !== existSameInfos[0]);
            Alerts = filteredArray;
        }

        Alerts.push(convertedSig);
        // let msg = "";
        // for (let i = 0; i < Alerts.length; i++) {
        //     let element = Alerts[i];
        //     if (element.License_ID == convertedSig.License_ID && element.symbol == convertedSig.symbol)
        //         msg += element.command + ", ";
        // }
        // console.log("all orders of same license/symbol: ", msg);

        res.status(200).send({ message: "Singal is received" });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : alertSignal is Failed " + " errorMessage:" + e.message });
    }
};

exports.GetOrderInfo = async (req, res) => {
    try {

        const separatedValues = req.body.split(',');

        let result = GetSpecifiedAlert(separatedValues[0].trim(), "", separatedValues[1].trim(), "");

        res.status(200).send({ message: "All orders:", orderInformation: result });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : GetOrderInfo is Failed " + " errorMessage:" + e.message });

    }
};


exports.Initialize = async (req, res) => {
    try {
        const separatedValues = req.body.split(',');

        RemoveSpecifiedAlert(separatedValues[0], separatedValues[1]);

        res.status(200).send({ message: "Singal is initialize" });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : alertSignal is Failed " + " errorMessage:" + e.message });
    }
};
