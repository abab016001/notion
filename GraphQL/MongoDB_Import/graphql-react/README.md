
要建立一個 GraphQL + React 專案，基本上會用到以下技術：
*   前端：React ( 搭配 Apollo Client 作為 GraphQL 客戶端 )
*   後端：GraphQL API

這裡提供一個簡單入門的專案架構與步驟，包含：
*   使用 Vite 建立 React 專案
*   使用 Apollo Client 串接一個簡單的 GraphQL API ( 例如 Countries API )

## 🔧 第一步：建立 React 專案（使用 Vite）
```bash
npm create vite@latest graphql-react
cd graphql-react
npm install
```

## 📦 第二步：安裝 Apollo Client 與 GraphQL
```bash
npm install @apollo/client graphql
```

## 🧠 第三步：設定 Apollo Client
建立檔案 `src/apolloClient.js`

## 💡 第四步：設定 ApolloProvider 串接 React
修改 `src/main.jsx`

## 🧪 第五步：撰寫 GraphQL 查詢與 React 組件
修改 `src/App.jsx`

### ApolloClient
ApolloClient 是 Apollo Client 套件中的一個主要類別，
它用來與GraphQL伺服器進行資料溝通。

#### ✅ 基本功能
1. <b>發送 GraphQL 查詢 ( Query ) 與變更 ( Mutation ) 請求</b> 到伺服器。
2. <b>快取 ( Cache ) 資料</b>，減少重複請求，提高效能。
3. 管理本地狀態 ( 選擇性使用 )
4. 與 React 整合，可搭配 @apollo/client/react 提供的 `<ApolloProvider>` 等元件使用。

#### ✅ 基本範例
```ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql', // 你的 GraphQL API 位置
  cache: new InMemoryCache(), // 使用記憶體快取
});
```
這樣就可以把 client 傳給 React App，讓它能使用 GraphQL

#### ✅ 為什麼需要它？
GraphQL 不像 REST 那樣是用 fetch 就能簡單串接的格式
它需要一套能處理 query 結構、變更、變數、快取、錯誤等的系統，而 Apollo Client 提供這些功能。

#### ✅ new ApolloClient 最基本的參數結構

```ts
const client = new ApolloClient({
  uri: 'https://your-api.com/graphql', // GraphQL API 的 URL
  cache: new InMemoryCache(),          // 必須提供一個快取策略
});
```

#### 🧩 new ApolloClient 可用的完整參數介紹
| 參數名稱               | 說明                                     |
| ------------------ | -------------------------------------- |
| `uri`              | 你的 GraphQL 伺服器 URL（字串）                 |
| `cache`            | Apollo 的快取實體，通常是 `new InMemoryCache()` |
| `headers`          | 自定義 HTTP 標頭，例如授權                       |
| `credentials`      | 設定是否傳送 cookie（如 `'include'`）           |
| `defaultOptions`   | 設定每次查詢/變更的預設行為                         |
| `link`             | 自定義 Apollo Link，替代 `uri`               |
| `name` / `version` | 用於 Apollo Devtools 上顯示名稱與版本            |

<b>🔐 帶授權的範例</b>

```ts
const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${yourToken}`
  },
  credentials: 'include', // 可選：送 cookie 給後端
});
```

<b>⚙️ 使用 defaultOptions 範例</b>

```ts
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});
```

<b>🔗 進階自定義 link（可擴充中介處理）</b>

```ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://api.example.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${yourToken}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### InMemoryCache

InMemoryCache 是 Apollo Client 提供的一種記憶體快取機制，它會：
1. <b>自動儲存伺服器回傳的資料</b>
2. <b>當相同查詢再次發送時</b>，優先從快取中取的資料 ( 根據設定 )，不一定每次都去伺服器抓
3. <b>支援快取更新與合併政策 ( type policies )</b>，適合處理分頁、物件合併。依 ID 尋找複雜情境。

<b>📦 基本用法：</b>

```js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    url: 'https://your-api/graphql',
    cache: new InMemoryCache(),
});
```

<b>🧩 補充功能</b>
*   可設定 `typePolicies` 控制物件合併邏輯。
*   支援自訂 ID 鍵 ( 例如不是用 id 當主鍵 )
*   可以結合 Reactive Variables 實作本地狀態管理。

| 問題               | 答案                          |
| ---------------- | --------------------------- |
| Cache 保存多久？      | 預設會一直存在，直到頁面刷新、手動清除或被新資料覆蓋。 |
| 如何知道 cache 是否過期？ | 要你自己加時間戳，自行判斷資料是否過期。        |
| 有無 TTL 功能？       | 沒有，但你可以自訂時間 + 控制清除。         |


<b>🔧 自訂快取處理</b>

為避免無法取得最新資料，Apollo 提供控制方法來 <b>避免使用過期快取</b>，你可以透過 `fetchPolicy` 來告訴 Apollo 要怎麼處理快取。

<b>✅ 解法一：設定 fetchPolicy（建議）</b>
在使用 `useQuery()` 或 `client.query()` 時，加入 `fetchPolicy` ：

<b>1. 總是從伺服器拿資料：</b>

```ts
const { data, loading } = useQuery(GET_DATA, {
    fetchPolicy: 'noework-only'
});
```

*   每次查詢都會請求伺服器，不用快取。

<b>2. 先從伺服器拿，成功後更新快取：</b>

```ts
const { data, loading } = useQuery(GET_DATA, {
    fetchPolicy: 'no-cache'
});
```

*   完全<b>不使用也不儲存</b>快取

<b>3. 先顯示快取，再背景更新（預設行為）：</b>

```ts

fetchPolicy: 'cache-first' // 預設值
```

<b>4. 先顯示快取，同時去網路拉新資料（推薦）</b>

```ts
fetchPolicy: 'cache-and-network'
```

*   快速顯示舊資料，但會重新請求伺服器，並更新畫面。
*   適合「希望即時但不想閃爍畫面」的場景。

<b>✅ 解法二：手動更新快取或使用 refetch</b>

```ts
const { data, refetch } = useQuery(GET_DATA);

// 手動重新拉取資料
button.onclick = () => {
    refetch();
};
```

<b>✅ 解法三：訂閱變動（GraphQL Subscriptions）</b>
如果你的後端支援 WebSocket，你可以用 `useSubscription()` 做到資料即時更新。