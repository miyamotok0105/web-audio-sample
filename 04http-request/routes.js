
const http = require("http");

const host = 'localhost';
const port = 8000;

const books = JSON.stringify([
    { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
    { title: "The Prophet", author: "Kahlil Gibran", year: 1923 }
]);

const authors = JSON.stringify([
    { name: "Paulo Coelho", countryOfBirth: "Brazil", yearOfBirth: 1947 },
    { name: "Kahlil Gibran", countryOfBirth: "Lebanon", yearOfBirth: 1883 }
]);
const requestListener = function (req, res) {
    
    switch (req.url) {
        case "/books":
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(books);
            break
        case "/authors":
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(authors);
            break
        default:
            res.setHeader("Content-Type", "application/json");
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }
}


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


