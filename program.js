const fs = require('fs')
const express = require('express');
const users = require('./dataFolder/MOCK_DATA.json');
const PORT = 3500;

var app = express();

//Middleware-plugin
app.use(express.urlencoded({ extended: false }));









app.use((req, res, next) => {
    var wholeReq = `[${req.ip}] ${req.method}: ${req.url}`;
    fs.appendFile('./log.txt', `${wholeReq}\n`, () => {
        console.log(wholeReq);
        next();
    });
})































app.get('/', (req, res) => {
    res.end("Hello welcome to landing page");
})
app.get('/user', (req, res) => {
    var html = `<ul>${users.map((user) => `<li>${user.first_name}</li>`).join('')}</ul>`;
    res.send(html);
})
app.get('/api/user', (req, res) => {
    res.json(users);
})
app.get('/api/user/:id', (req, res) => {
    console.log(req.params);
    var user = users.find(user => user.id == req.params.id);
    if (user == undefined)
        return res.send(`user with id:${req.params.id} doesn't exist`);
    else
        return res.json(user);
});
app.post('/api/user', (req, res) => {
    var body = req.body;
    console.log(body);
    var data = { id: users.length + 1, ...body };
    users.push(data)
    fs.writeFile('./dataFolder/MOCK_DATA.json', JSON.stringify(users), () => {
        return res.json({ status: 'successful', id: users.length });
    });
    return 0;
})
app.delete('/api/user/:id', (req, res) => {
    var id = (Number(req.params.id));
    var index = users.findIndex(user => user.id == id);
    console.log('delete: ', index);
    var user = users.splice(index, 1);
    fs.writeFile('./dataFolder/MOCK_DATA.json', JSON.stringify(users), () => {
        return res.json({ status: 'successfully deleted', details: user });
    });
})













app.patch('/api/user/:id', (req, res) => {
    var id = (Number(req.params.id));
    var index = users.findIndex(user => user.id == id);
    console.log(`update request id:${id}`);


    if (index > -1) {
        var body = req.body;
        var data = { id: id, ...body };
        users.splice(index, 1, data);
        fs.writeFile('./dataFolder/MOCK_DATA.json', JSON.stringify(users), () => {
            return res.json({ status: 'successfully updated', details: data });
        });
    }
    else {
        res.json({ status: `sorry id:${req.params.id} doesn't exist` });
    }
})








app.listen(PORT, () => console.log(`server is running... http://localhost:${PORT}`));

