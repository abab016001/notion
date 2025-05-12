## ApolloServer

```js
const server = new ApolloServer({ typeDefs, resolvers });
```
typeDefs, resolvers 是 GraphQL 的核心概念
<div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
    <div style="width: 45%; min-width: 333px;">
        <h3 style="border-bottom: 2px solid black; padding-bottom: 5px;">typeDefs</h3>
        <div>
            <b>用來定義 資料結構</b>
            <p>🔹 typeDefs（Type Definitions）</p>
            <ul>
                <li>是 GraphQL Schema 的定義</li>
                <li>
                    用來描述你的 API 提供哪些「資料型別」（types）、欄位（fields）、查詢（Query）與變更（Mutation）等。
                </li>
            </ul>
        </div>
    </div>
    <div style="width: 45%; min-width: 333px;">
        <h3 style="border-bottom: 2px solid black; padding-bottom: 5px;">resolvers</h3>
        <div>
            <b>用來定義 如何取到資料</b>
            <p>🔸 resolvers</p>
            <ul>
                <li>是實作 typeDefs 中的每個欄位要如何回傳資料。</li>
                <li>
                    就像是「控制器」或「邏輯函式」，負責從資料庫或其他地方取得資料。
                </li>
            </ul>
        </div>
    </div>
</div>

### Resolver
```js
const resolvers = {
    Query: {
        users: () => User.find(),
        user: (_, { id }) => User.findById(id),
    },
    Mutation: {
        addUser: (_, { name, age, email }) => User.create({ name, age, email }),
    },
}
```
```js
users: () => User.find()
```
是<b>建立了一個查詢物件 ( Query object ) </b>
只有當：
*   await User.find()
*   User.find.then(...)
*   或 Apollo Server 將它包起來自動執行

才是真正送出查詢

<b style="font-size: 1.5rem;">❌ MongooseError: Query was already executed: User.find({})</b>

表示你在 GraphQL 的 resolver 裡，對同一個查詢物件 <b>重複執行了 User.find() 的結果</b>。

<b>✅ 原因是 Apollo Server 自動做了「額外的事」</b>
當你寫這樣的 resolver：

```js
users: () => User.find()
```

Mongoose 傳回的是一個「可執行的查詢物件」 (Query)

Apollo Server 會先檢查這個物件的內容，來格式化它成 JSON，給 Playground 或 HTTP 回傳。

這時就會觸發 <b>第一次查詢執行</b>（透過 .then() 或 .toJSON()）。

<b>但 Apollo 還會再去執行一次它自己認為的查詢流程。</b>

⚠️ 所以這樣就變成 <b>重複執行兩次同一個查詢物件</b> ➜ 產生錯誤：
```graphql
MongooseError: Query was already executed
```

<b>✅ 正確做法（讓 Apollo 拿到查詢結果，而不是查詢物件）</b>

把它改成: 
```js
users: async () => await User.find(),
```
或更簡潔:
```js
users: async () => User.find(),
```

這樣 Apollo Server 拿到的是查詢結果（Array of users），而不是 Query 實例。