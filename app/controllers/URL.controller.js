let OpenOrderInfo = {
    Type: -1,
    Lot: 0,
    Ticket: -1,
    Symbol: "",

};
let CloseOrderInfo = {
    _Type: -1,
    _Ticket: -1,
    _Symbol: "",

};



// Create and Save a new Tutorial

let Alerts = [];

const fs = require('fs');

exports.Check = async (req, res) => {
    res.status(200).send({ message: "!!! OK !!!" });
    await PrintLog("URL is Checked");
};


// Retrieve all Tutorials from the database.
exports.Login = async (req, res) => {
    try {
        kind = req.body.kind;
        msg = "Slave Login is success";

        if (kind == 0) {
            OpenOrderInfo.Type = -1;
            OpenOrderInfo.Lot = 0;
            OpenOrderInfo.Ticket = -1;
            OpenOrderInfo.Symbol = "";

            msg = "Master Login is success"
        }

        await PrintLog(msg);
        res.status(200).send({ message: msg });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : Login is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : Login is Failed " + " errorMessage:" + e.message);
    }
};

exports.History = async (req, res) => {
    try {
        let msg = await ReadLog(req);

        res.status(200).send({ message: msg });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : History is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : History is Failed " + " errorMessage:" + e.message);
    }
};

exports.HistoryClear = async (req, res) => {
    try {
        OpenOrderInfo.Type = -1;
        OpenOrderInfo.Lot = 0;
        OpenOrderInfo.Ticket = -1;
        OpenOrderInfo.Symbol = "";

        CloseOrderInfo._Type = -1;
        CloseOrderInfo._Ticket = -1;
        CloseOrderInfo._Symbol = "";

        let msg = await PrintLog("HistoryClear");
        res.status(200).send({ message: msg });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : HistoryClear is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : HistoryClear is Failed " + " errorMessage:" + e.message);
    }
};

exports.TVOpenSignal = async (req, res) => {
    try {
        msg = "";
        if (req.body.position != "0") {
            OpenOrderInfo.Type = req.body.type == "buy" ? 0 : 1;
            OpenOrderInfo.Lot = req.body.lot;
            OpenOrderInfo.Symbol = req.body.symbol;
            const d = new Date();
            let time = d.getTime();
            OpenOrderInfo.Ticket = time;
            msg = "New Order is stored. Type: " +
                (OpenOrderInfo.Type == 0 ? "Buy," : "Sell,") +
                " Lot: " + OpenOrderInfo.Lot + "," +
                " Ticket: " + OpenOrderInfo.Ticket +
                " Symbol: " + OpenOrderInfo.Symbol;
        }
        else {
            CloseOrderInfo._Type = req.body.type == "buy" ? 0 : 1;
            CloseOrderInfo._Symbol = req.body.symbol;
            const d = new Date();
            let time = d.getTime();
            CloseOrderInfo._Ticket = time;
            msg = "close Order is stored. Type: " +
                (CloseOrderInfo._Type == 0 ? "Buy," : "Sell,") +
                " Ticket: " + CloseOrderInfo._Ticket +
                " Symbol: " + CloseOrderInfo._Symbol;
        }
        console.log(msg);
        await PrintLog(msg);
        res.status(200).send({ message: msg });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : TVOpenSignal is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : TVOpenSignal is Failed " + " errorMessage:" + e.message);
    }
};


exports.AlertSignal = async (req, res) => {
    try {
        msg = "";
        let alertSignal = {
            AlertType: -1,
            AlertSymbol: "",
            AlertTicket: -1,
        };
        alertSignal.AlertType = req.body.type == "buy" ? 0 : 1;
        alertSignal.AlertSymbol = req.body.symbol;
        const d = new Date();
        let time = d.getTime();
        alertSignal.AlertTicket = time;
        let month = d.getMonth() + 1;
        msg = "New Order is stored. Type: " +
            (alertSignal.AlertType == 0 ? "Buy," : "Sell,") +
            " Time: " + d.getFullYear() + "-" + month + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "," +
            " Ticket: " + alertSignal.AlertTicket +
            " Symbol: " + alertSignal.AlertSymbol;
        console.log(msg);
        await PrintLog(msg);

        let find = false;
        for (let i = 0; i < Alerts.length; i++) {
            _alert = Alerts[i];
            if (_alert.AlertSymbol == req.body.symbol) {
                find = true;
                Alerts[i] = { ...alertSignal };
            }
        }
        if (!find)
            Alerts.push(alertSignal);

        res.status(200).send({ message: msg });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : alertSignal is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : alertSignal is Failed " + " errorMessage:" + e.message);
    }
};

// exports.OpenOrder = async (req, res) => {
//     try {
//         OpenOrderInfo.Type = req.body.type;
//         OpenOrderInfo.Lot = req.body.lot;
//         OpenOrderInfo.Ticket = req.body.ticket;
//         msg = "New Order is stored. Type: " +
//             (OpenOrderInfo.Type == 0 ? "Buy," : "Sell,") +
//             " Lot: " + OpenOrderInfo.Lot + "," +
//             " Ticket: " + OpenOrderInfo.Ticket;
//         console.log(msg);
//         await PrintLog(msg);
//         res.status(200).send({ message: msg });
//     }
//     catch (e) {
//         res.status(500).send({ message: " Error 500 : OrderOpen is Failed " + " errorMessage:" + e.message });
//         await PrintLog(" Error 500 : OrderOpen is Failed " + " errorMessage:" + e.message);
//     }
// };

// exports.CloseOrder = async (req, res) => {
//     try {
//         CloseTicket = req.body.ticket;
//         msg = "Close Order is stored. Ticket: " + CloseTicket;
//         console.log(msg);
//         await PrintLog(msg);
//         res.status(200).send({ message: msg });
//     }
//     catch (e) {
//         res.status(500).send({ message: " Error 500 : CloseOrder is Failed " + " errorMessage:" + e.message });
//         await PrintLog(" Error 500 : CloseOrder is Failed " + " errorMessage:" + e.message);
//     }
// };

exports.GetOrderInfo = async (req, res) => {
    try {
        res.status(200).send({ message: "Information:", openInformation: OpenOrderInfo, closeInformation: CloseOrderInfo });
        //await PrintLog("GetOrderInfo is success");
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : GetOrderInfo is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : GetOrderInfo is Failed " + " errorMessage:" + e.message);
    }
};

exports.GetAlertInfo = async (req, res) => {
    try {
        sym = req.body.symbol;
        let alertSignal = {
            AlertType: -1,
            AlertSymbol: "",
            AlertTicket: -1,
        };

        for (let i = 0; i < Alerts.length; i++) {
            let _alert = Alerts[i];
            if (_alert.AlertSymbol == req.body.symbol) {
                alertSignal = { ..._alert };
            }
        }

        res.status(200).send({ message: "Information:", alertInformation: alertSignal });

        //await PrintLog("GetOrderInfo is success");
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : GetAlertInfo is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : GetAlertInfo is Failed " + " errorMessage:" + e.message);
    }
};

const PrintLog = async (msg) => {
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
    const fileName = year + "_" + month + "_" + date + ".txt";
    if (msg != "HistoryClear") {
        const Resultdata = await fs.promises.appendFile(fileName, date_time + " => " + msg + "\n", err => {
            if (err) {
                console.error(err);
                console.log("File write is failed", fileName);
            }
            // file written successfully       
        });
    }
    else {
        const Resultdata = await fs.promises.writeFile(fileName, date_time + " => " + msg + "\n", err => {
            if (err) {
                console.error(err);
                console.log("File write is failed", fileName);
            }
            // file written successfully       
        });
    }
}


const ReadLog = async (req) => {
    year = req.body.year;
    month = req.body.month;
    date = req.body.date;
    const fileName = year + "_" + month + "_" + date + ".txt";

    const Resultdata = await fs.promises.readFile(fileName, (err, data) => {
        if (err) {
            console.log(fileName + " reaing error");
            throw err;
        }
    })
    return Resultdata.toString();
}