let OrderInfo = {
    Type: -1,
    Lot: 0,
    Ticket: -1,
    Symbol: "",
    Position: 0
};
let CloseTicket = -1;
const { Console } = require('console');
// Create and Save a new Tutorial

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
            OrderInfo.Type = -1;
            OrderInfo.Lot = 0;
            OrderInfo.Ticket = -1;
            CloseTicket = -1;
            OrderInfo.Symbol = "";
            OrderInfo.Position = 0;
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
        OrderInfo.Type = req.body.type == "buy" ? 0 : 1;
        OrderInfo.Lot = req.body.lot;
        OrderInfo.Position = req.body.position;
        OrderInfo.Symbol = req.body.symbol;
        const d = new Date();
        let time = d.getTime();
        OrderInfo.Ticket = time;
        msg = "New Order is stored. Type: " +
            (OrderInfo.Type == 0 ? "Buy," : "Sell,") +
            " Lot: " + OrderInfo.Lot + "," +
            " Ticket: " + OrderInfo.Ticket +
            " Symbol: " + OrderInfo.Symbol +
            " Position: " + OrderInfo.Position;
        console.log(msg);
        await PrintLog(msg);
        res.status(200).send({ message: msg });
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : TVOpenSignal is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : TVOpenSignal is Failed " + " errorMessage:" + e.message);
    }
};

// exports.OpenOrder = async (req, res) => {
//     try {
//         OrderInfo.Type = req.body.type;
//         OrderInfo.Lot = req.body.lot;
//         OrderInfo.Ticket = req.body.ticket;
//         msg = "New Order is stored. Type: " +
//             (OrderInfo.Type == 0 ? "Buy," : "Sell,") +
//             " Lot: " + OrderInfo.Lot + "," +
//             " Ticket: " + OrderInfo.Ticket;
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
        res.status(200).send({ message: "Information:", openInformation: OrderInfo });
        await PrintLog("GetOrderInfo is success");
    }
    catch (e) {
        res.status(500).send({ message: " Error 500 : GetOrderInfo is Failed " + " errorMessage:" + e.message });
        await PrintLog(" Error 500 : GetOrderInfo is Failed " + " errorMessage:" + e.message);
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