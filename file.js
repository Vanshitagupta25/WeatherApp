const http = require("http");
const fs = require("fs");
const requests = require("requests");

const replaceVal = (tempVal ,orgVal) => {
  let temperature = tempVal.replace("{%tempval%}" , orgVal.main.temp);
   temperature = temperature.replace("{%tempmin%}" , orgVal.main.temp_min);
   temperature = temperature.replace("{%tempmax%}" , orgVal.main.temp_max);
   temperature = temperature.replace("{%location%}" , orgVal.name);
   temperature = temperature.replace("{%country%}" , orgVal.sys.country);
   temperature = temperature.replace("{%tempstatus%}" , orgVal.weather[0].main);
   return temperature;

}
const homeFile = fs.readFileSync("index.html", "utf-8");

const server = http.createServer((req, res) => {
  if (req.url == "/contact") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Indore&appid=7b1454d19e226910e6d3dba9db198dcb"
    )
      .on("data", (chunk) => {
        const myobj = JSON.parse(chunk);
        const arrData = [myobj];
        const realTimeData = arrData
        .map((val) => replaceVal(homeFile, val))
        .join("");
        res.write(realTimeData);
        // console.log(arrData[0].main.temp);
        // res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(8000, "127.0.0.1");
