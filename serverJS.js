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
var httpserver = http.createServer(app);
var socketIO=require("socket.io");
var socketServer=socketIO.listen(httpserver);
// var users=[];

httpserver.listen(8080,function () {
    console.log("working on port 8080");
})


socketServer.on("connect",function (socket) {
    socket.on("message",function (data) {
        var type=data.type;
        switch (type){
            case "101":
                handleUserLogin(socket,data);
                break;
            case "201":
                handleChatMsg(socket,data);
                break;
        }
    })
    // //昵称设置
    // socket.on('login', function(nickname) {
    //     if (users.indexOf(nickname) > -1) {
    //         socket.emit('nickExisted');
    //     } else {
    //         socket.userIndex = users.length;
    //         socket.nickname = nickname;
    //         users.push(nickname);
    //         socket.emit('loginSuccess');
    //         socketServer.sockets.emit('system', nickname); //向所有连接到服务器的客户端发送当前登陆用户的昵称
    //     };
    // });
})
//登录信息提示---------------------------
function handleUserLogin(socket,data){
    socket.nickname=data.nickname;
    var content={
        type:"101",
        nickname:data.nickname
    };
    //群发除了自己
    socket.broadcast.send(content);
    //发给自己
    content.type="100";
    socket.send(content);
}
//发送消息提示--------------------------
function handleChatMsg(socket,data) {
    var message={
        type:"201",
        nickname:socket.nickname,
        content:data.content
    }
    //群发，除了自己
    socket.broadcast.send(message);
    //发给自己
    message.type="200";
    socket.send(message);
}


