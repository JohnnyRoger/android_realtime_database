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

    instance.addTrigger({
        name: 'test',
        expression: 'nodeserver_realtime.accounts',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: e => {
            io.on('connection', (socket) => {
                socket.on('balance', () => {
                    io.emit('balance', '50')
                    console.log(balance);
                });
                console.log("New Socket Connection" + socket.id)


            });

            console.log(e);
        }
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

    connection.query("select * from accounts where user_id=1", function (err, rows) {
        if (!err) {
            console.log("yes")
            if (rows.length > 0) {
                const balance = rows[0]['balance'];
                console.log(balance);


            } else {
                console.log("No data!");
            }
        } else {
            console.log(err);
        }
    });
}



program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);

module.exports = router;