# MongoDB 搭配 REST API

## 1. 使用 Express 建立 REST API：
安裝 Express 和 Mongoose
```bash
npm install express mongoose
```

## 2. 建立 API 範例

---

# Express 模組

Express 模組是 Node.js 最常用的 <b>Web 應用框架</b> ，全名是 <b>Express.js</b>
可以更快建立 Web 應用程式和 API

> Express 是建立伺服器和路由的工具

## 核心功能簡介：

### 1. 處理 HTTP 請求與回應 (Request/Response)
### 2. 路由系統 ( Routing ) : 可定義不同網址回應的處理方式
### 3. 中介軟體 ( Middleware ) 機制 : 可再請求與回應之間進行處理 ( 例如：驗證、日誌 )
### 4. 支援模板引擎 ( 如 EJS、Pug )
### 5. 可擴充性強 : 有大量中介軟體可以使用

## 安裝
```bash
npm intall express
```

---

# Faker 隨機假資料
<b>✅ 安裝 faker</b>
```bash
npm install @faker-js/faker
```

<b>📦 範例：產生隨機使用者資料</b>

```js
// index.js
const { faker } = require('@faker-js/faker');

// 產生 5 筆假使用者資料
for (let i = 0; i < 5; i++) {
  const user = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    country: faker.location.country(),
    createdAt: faker.date.past()
  };

  console.log(user);
}
```

<b>🔸 faker.person（人名相關）</b>

```js
faker.internet.email()             // 隨機 email
faker.internet.username()         // 使用者名稱
faker.internet.password()         // 密碼
faker.internet.url()              // 網址
faker.internet.ip()               // IP 位址
faker.internet.mac()              // MAC 位址
faker.image.avatar()           // 頭像圖片 URL
```

<b>🔸 faker.location（地理資訊）</b>

```js
faker.location.city()             // 城市
faker.location.state()            // 州/省
faker.location.country()          // 國家
faker.location.streetAddress()    // 街道地址
faker.location.zipCode()          // 郵遞區號
faker.location.latitude()         // 緯度
faker.location.longitude()        // 經度
```

<b>🔸 faker.phone（電話）</b>

```js
faker.phone.number()              // 電話號碼
```

<b>🔸 faker.company（公司資訊）</b>

```js
faker.company.name()              // 公司名稱
faker.company.catchPhrase()       // 公司口號
faker.company.buzzPhrase()        // 商業術語
```

<b>🔸 faker.finance（財務）</b>

```js
faker.finance.accountNumber()     // 帳戶號碼
faker.finance.amount()            // 金額
faker.finance.currencyCode()      // 貨幣代碼 (e.g., USD)
faker.finance.iban()              // IBAN
```

<b>🔸 faker.commerce（商業與商品）</b>

```js
faker.commerce.productName()      // 商品名稱
faker.commerce.department()       // 商品分類
faker.commerce.price()            // 價格
```

<b>🔸 faker.date（時間與日期）</b>

```js
faker.date.past()                 // 過去的日期
faker.date.future()               // 未來的日期
faker.date.recent()               // 最近的日期
faker.date.birthdate()            // 出生日期
```

<b>🔸 faker.string（字串工具）</b>

```js
faker.string.uuid()               // UUID
faker.string.alphanumeric(10)     // 英數混合字串（長度為 10）
```

<b>🔸 faker.helpers（輔助工具）</b>

```js
faker.helpers.arrayElement(['A', 'B', 'C'])   // 從陣列中隨機選一個
faker.helpers.multiple(() => faker.person.fullName(), { count: 5 }) // 產生多筆資料
```