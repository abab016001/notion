# 安裝
```
npm install apollo-server-express graphql mongoose
```

```js
const server = new ApollorServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
```

```server.applyMiddleware({ app });```
是在使用 <b>Apollo Sever</b> 搭配 <b>Express</b> 的時候
將 Apollo GraphQL 中介軟體 ( middleware ) 套用到 Express 應用上的方法

<b>✅ 功能：</b>
```server.applyMiddleware({ app });``` 做了什麼
*   它讓你的 Express App 可以處理 ```/graphql``` 路徑的請求。
*   實際上就是把 Apollo Server 的處理邏輯掛載到自己的Express應用上
*   ```server.graphqlPath``` 通常預設是 ```/graphql``` ，也可以自訂：

```js
server.addplyMiddleware({ app, path: '/api' });
```

# 建立後台管理介面
後台管理系統可以使用前端框架如 React 或 Vue 搭配管理後端資料。
<b>例如，使用 React 實現後台操作：</b>
1. 安裝 React 和所需依賴：

```bash
npx create-react-app admin-dashboard
cd admin-dashboard
npm install axios
```

## GraphQL 內建的標準資料型別
*   Int: 整數
*   Float: 浮點數
*   String: 字串
*   Boolean: 布林值
*   ID: 唯一識別碼 ( 常用於資料 ID )

# 測試

## ✅ 方法一：使用內建 GraphQL Playground（建議開發階段）

如果使用的是 Apollo Server 或 GraphQL Yoga，通常會內建 GraphQL Playground：
<b>使用步驟</b>
1. 啟動你的 GraphQL 伺服器

```js
node main.js
```

2. 打開瀏覽器，進入：
```
http://localhost:3000/graphql
```
3. 在 Playground 中輸入查詢語法，例如：
<b>查詢 (Query)</b>
```graphql
query {
    items {
        id
        name
        description
    }    
}
```

<b>新增資料 (Mutation)</b>
```graphql
mutation {
    addItem(name: "測試名稱", description: "測試描述") {
        id
        name
    }
}
```

## ✅ 方法二：使用 Postman 測試 GraphQL
1. 打開 Postman
2. 建立一個新的請求
3. 方法選擇 POST
4. URL 輸入 http://localhost:3000/graphql
5. 切換到 Body -> 選擇 GraphQL
6. 在左側輸入 GraphQL 查詢或 Mutation
```graphql
query {
    items {
        id
        name
    }
}
```

## ✅ 方法三：使用 curl 測試 GraphQL
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ items { id name description } }"}'
```

## ✅ 方法四：使用 Apollo Studio（需上線）
如果你將GraphQL API 部屬到網路 (如Vercel, Heroku 等)，可以：
*   註冊 Appllo Studio 帳號
*   連接到你的 API endpoint
*   使用線上 Playground 介面操作