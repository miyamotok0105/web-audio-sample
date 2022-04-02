const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer(requestListener);
// httpサーバーを起動する。
server.listen((process.env.PORT || 3000), function () {
  console.log((process.env.PORT || 3000) + 'でサーバーが起動しました');
});

const books = JSON.stringify([
  { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { title: "The Prophet", author: "Kahlil Gibran", year: 1923 }
]);
const authors = JSON.stringify([
  { name: "Paulo Coelho", countryOfBirth: "Brazil", yearOfBirth: 1947 },
  { name: "Kahlil Gibran", countryOfBirth: "Lebanon", yearOfBirth: 1883 }
]);

/**
 * サーバーにリクエストがあった際に実行される関数
 */
function requestListener(request, response) {
  const requestURL = request.url;

  // API
  switch (requestURL) {
    case "/books":
      response.setHeader("Content-Type", "application/json");
      response.writeHead(200);
      response.end(books);
      return;
      break;
  }

  // ファビコン
  if (request.url === '/favicon.ico') {
    response.writeHead(200, {'Content-Type': 'image/x-icon'} );
    response.end();
    console.log('favicon requested');
    return;
  }

  // リクエストのあったファイルの拡張子を取得
  const extensionName = path.extname(requestURL);
  // ファイルの拡張子に応じてルーティング処理
  switch (extensionName) {
    case '.html':
      readFileHandler(requestURL, 'text/html', false, response);
      break;
    case '.css':
      readFileHandler(requestURL, 'text/css', false, response);
      break;
    case '.js':
    case '.ts':
      readFileHandler(requestURL, 'text/javascript', false, response);
      break;
    case '.png':
      readFileHandler(requestURL, 'image/png', true, response);
      break;
    case '.jpg':
      readFileHandler(requestURL, 'image/jpeg', true, response);
      break;
    case '.gif':
      readFileHandler(requestURL, 'image/gif', true, response);
      break;
    case '':
      readFileHandler(requestURL, 'application/json', true, response);
      break;
    default:
      // HTML
      readFileHandler('/client1.html', 'text/html', false, response);
      readFileHandler('/client2.html', 'text/html', false, response);
      break;
  }
}

/**
 * ファイルの読み込み
 */
function readFileHandler(fileName, contentType, isBinary, response) {
  // エンコードの設定
  const encoding = !isBinary ? 'utf8' : 'binary';
  const filePath = __dirname + fileName;

  fs.exists(filePath, function (exits) {
    if (exits) {
      fs.readFile(filePath, {encoding: encoding}, function (error, data) {
        if (error) {
          response.statusCode = 500;
          response.end('Internal Server Error');
        } else {
          response.statusCode = 200;
          response.setHeader('Content-Type', contentType);
          if (!isBinary) {
            response.end(data);
          }
          else {
            response.end(data, 'binary');
          }
        }
      });
    }
    else {
      // ファイルが存在しない場合は400エラーを返す。
      response.statusCode = 400;
      response.end('400 Error');
    }
  });
}

const socketio = require('socket.io')
const io = socketio(server);

// サーバーへのアクセスを監視。アクセスがあったらコールバックが実行
io.sockets.on('connection', function (socket) {
  const dataToClient = {hoge: 1};   // クライアントに送信するデータ
  // 接続元のクライアントだけにデータ送信。
  socket.emit('dataName1', dataToClient);
  // 接続元のクライアント以外にデータ送信
  socket.broadcast.emit('dataName1', dataToClient);

  // クライアントからのデータの受信
  socket.on('dataName2', function (dataFromClient) {
    // 「piyo」という文字列がターミナルに出力される。
    console.log(dataFromClient.fuga);
  });
});