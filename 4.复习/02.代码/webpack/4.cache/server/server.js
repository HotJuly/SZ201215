const {resolve} = require('path');
const express = require('express');
const chalk = require('chalk');

const app =express();

app.use(
    express.static(resolve(__dirname,"build"),{
        maxAge:3600000
    })
)


app.listen(3000,function(err){
    if(err) return;
    console.log(chalk.green('服务器成功启动于:')+chalk.yellow('http://localhost:3000'))
})