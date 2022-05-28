const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const express = require("express");
const router = express.Router();
const fs = require('fs');
const socket = require('socket.io');
const app = express();
// const port = '9000';
let server = app.listen(8000, () => {
    console.log('Listening', server.address().port)
})
const io = socket(server);

const program = async () => {
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'E=mc2',
        database: "nodeserver_realtime",
    });

    const instance = new MySQLEvents(connection, {
        startAtEnd: true,
        excludedSchemas: {
            mysql: true,
        },
    });

    await instance.start();

    var balance = 0;

    instance.addTrigger({
        name: 'test',
        expression: 'nodeserver_realtime.accounts',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: e => {
            console.log(e);
            connection.query("select * from accounts where user_id=1", function (err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        balance = rows[0]['balance'];
                        console.log(balance);
                    } else {
                        console.log("No data!");
                    }
                } else {
                    console.log(err);
                }
            });
        }
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

    io.on('connection', (socket) => {
        socket.on('balance', () => {
            io.emit('balance', balance)
            //console.log(balance);
        });
        console.log("New Socket Connection" + socket.id)
    });
    io.on("connect_error", (err) => {
        console.log(err.message); // prints the message associated with the error
    });



}



program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);

module.exports = router;