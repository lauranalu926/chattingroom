/**
 * Created by hxsd on 2016/11/11.
 */
var http=require("http");
var express=require("express");
var path=require("path");
var app=express();

//静态----------------------------------
var staticPath=path.resolve(__dirname,"public");
app.use(express.static(staticPath));

//引入socket----------------------------
var httpserver=http.createServer(app);
var socketIO=require("socket.io");
var socketServer=socketIO.listen(httpserver);

socketServer.on("connect",function (socket) {
    console.log("new users");
    socket.emit("message","welcome!");
})

httpserver.listen(8080,function () {
    console.log("working on port 8080");
})