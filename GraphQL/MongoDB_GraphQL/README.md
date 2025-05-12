1. 安裝套件
```bash
npm init -y
npm install apollo-server mongoose graphql
```
## Apollo Server

## MongoDB 資料模型 (使用 Mongoose )
<b>安裝 MongeDB</b>
[MongoDB Community Server](https://www.mongodb.com/try/download/community)

<b>✅ 業界常見的資料匯入方式</b>
| 類型          | 工具或方式                                 | 適用情境                           |
| ----------- | ------------------------------------- | ------------------------------ |
| 📦 一次性大量匯入  | `mongoimport`, `mongoose.bulkWrite()` | 從 CSV、JSON 等批次導入資料庫（ex: 初始化系統） |
| 🔄 定時自動匯入   | 使用排程器（如 `cron` + node 腳本）             | 每日自動匯入報表、第三方資料                 |
| 🌐 API 接收   | REST/GraphQL + 後台 admin 操作            | 讓使用者匯入資料，並由後端驗證與儲存             |
| 📋 管理系統匯入   | 後台提供上傳功能（CSV / Excel）                 | 可由非工程師操作上傳資料                   |
| ☁️ ETL 工具   | Airbyte、Apache NiFi、Pentaho 等         | 複雜資料流處理、跨系統搬資料                 |
| 🧪 測試用假資料工具 | Faker.js、Mockaroo                     | 自動產生符合邏輯的假資料（模擬真實使用）           |


## GraphQL 

### GraphQL Playground 測試

<b>✅ 第一步：啟動你的 GraphQL Server</b>

執行命令: 
```bash
node index.js
```
terminal 輸出
```bash
Server ready at http://localhost:4000/
```

<b>✅ 第二步：開啟 GraphQL Playground</b>

打開你的瀏覽器，前往：
```http
http://localhost:4000/
```

<b>✅ 第三步：撰寫測試語法</b>

你可以在 Playground 中直接輸入 GraphQL 查詢語法：

<b>🔍 查詢全部使用者</b>
```graphql
query {
  users {
    id
    name
    age
    email
  }
}
```

<b>➕ 新增使用者</b>
```graphql
mutation {
    addUser(name: "Alice", age: 28, email: "alice@example.com") {
        id
        name
    }
}
```

<b>🔎 查詢特定使用者（用 ID）</b>
```graphql
query {
  user(id: "PUT_ID_HERE") {
    name
    age
  }
}
```

### Postman 測試