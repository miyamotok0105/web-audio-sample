
```
npm run start
http://localhost:3000/index.html


npm run start2
http://localhost:3000/public/client1.html
http://localhost:3000/public/client2.html
http://localhost:3000/books
```

socket.ioにはグループに限定して通信するroom機能がある。


```JavaScript:
const data = { hoge: 1 }; // 送信データ例
// roomIDのグループ(ルーム)に入れる
socket.join("roomID");

// 全クライアントへ送る
socket.emit('roomID', "hoge");

// roomIDにデータを送信する
socket.to("roomID").emit("someData", data);

// 特定クライアントに送信、見た目上同じコード
socket.to('socetID').emit('event', param);

//送信元以外の全クライアントに送信
io.broadcast.emit('event', param); 

```


