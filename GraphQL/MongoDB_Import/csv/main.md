# mongoose
```js
const mongoose = require("mongoose");
```

> Node.js 使用 CommonJS 模組系統引入 Mongoose

### Mongoose 是什麼 ?
Mongoose 是一個 <b>MongoDB 的 ODM (Object Data Modeling) 工具</b>
可以用 Javascript 的物件方式操作 MongoDB資料
*   定義資料的結構 (Schema)
*   建立與查詢資料
*   設定驗證規則、資料關聯...等

<b>範例：</b>

```js
const mongoose = require("mongoose");

// 連接到 MongoDB 資料庫
mongoose.connect("mongodb://localhost:27017/mydb");

// 定義一個 User 模型
const User = mongoose.model("User", {
    name: String,
    age: Number
});

// 新增一筆資料
const user = new User({ name: "Alice", age: 25 });
user.save().then(() => console.log("User saved"));
```


---
# fs
```js
const fs = require("fs");
```

> Node.js引入 <b>內建模組 fs ( File System 檔案系統 )</b>

fs 模組提供存取檔案系統的功能：
*   讀取檔案 ( fs.readFile )
*   寫入檔案 ( fs.writeFile )
*   建立資料夾、刪除檔案、監聽檔案變動..等

<b>簡單範例：</b>

```js
const fs = require("fs");

// 寫入檔案
fs.writeFile("example.txt", "Hello, world!", (err) => {
    if (err) throw err;
    console.log("檔案已寫入!")
});

// 讀取檔案
fs.readFile("example.txt", "uft8", (err, data) => {
    if (err) throw err;
    console.log("讀取檔案: ", data);
});
```

---
# csv-parser
```js
const csv = require("csv-parser");
```

> Node.js引入第三方套件 csv-parser，用來 <b>讀取並解析 CSV 檔案</b>

這個套件可以把 CSV 格式的文字資料轉成 JavaScript 物件

> 📦 注意：csv-parser 並不是 Node.js 內建的模組，你需要先安裝它
```bash
npm install csv-parser
```

<b>範例：</b>

假設有個 data.csv：

```csv
name,age
Alice,30
Bob,25
```

js 解析：

```js
const fs = require("fs");
const csv = require("csv-parser");

fs.createReadStream("data.csv")
    .pipe(csv()) // 將資料輸出給 csv-parser 處理
    .on("data", (row) => {
        console.log("讀取一列資料: ", row);
    })
    .on("end", () => {
        console.log("CSV 讀取完成");
    });
```

輸出：
```console
讀到一列資料： { name: 'Alice', age: '30' }
讀到一列資料： { name: 'Bob', age: '25' }
CSV 讀取完成！
```

> pipe()

是一個 <b>串接 ( stream piping ) 資料流的方法 </b>
常用在處理大量資料時
讓你可以 <b>把一個 readable stream ( 可讀資料流 ) 輸出直接接到另一個 writeable 或 transform stream ( 可寫 / 可轉換資料流 )</b>

```js
.pipe(csv())
```
就是把讀到的 CSV 原始文字資料「送進」csv-parser 這個轉換器