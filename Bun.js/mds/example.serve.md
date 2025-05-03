/example/serve
# Hello API + 路由管理、CORS
<b> 功能清單：</b>
* ```/hello```：回傳 JSON {message: "Hello Bun!"}
* 所有 API 支援 CORS ( 允許跨域請求 )
* 簡單的路由表 ( 方便擴充 )

## 1. 新增資料夾
```bash
mkdir hello-cors-root
cd hello-cors-root
```
## 2. 建立新專案
```bash
bun init -y
```
## 3. index.ts
```ts
import { serve } from "bun";

// 路由表 (key 是路徑，value 是 handler function)
const routes: Record<
    string, 
    (req: Request) => Response | Promise<Response>
> = {
    "/hello": () => {
        return Response.json({ message: "Hello Bun!" })
    }
 };

 // 處理 CORS
 function handleCORS(req: Request): Response | null {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
        });
    }
    return null;
 };

 // 服務
 const server = serve({
    port: 3000,
    fetch(req: Request): Response | Promise<Response> {
        const cors = handleCORS(req);
        if (cors) return cors;

        const url = new URL(req.url);
        const handler = routes[url.pathname];

        if (handler) {
            const res = handler(req);
            // 加上 CORS headers
            return Promise.resolve(res).then((response) => {
                response.headers.set("Access-Control-Allow-Origin", "*");
                return response;
            });
        }

        return new Response("Not Found", { status: 404 });
    }
 });

 console.log(`Server running at http://localhost:${server.port}`);
```
## 4. 執行
```bash
## 執行
bun index.ts
## 回傳
Server running at http://localhost:3000

## 測試
curl http://localhost:3000/hello
## 回傳
{"message":"Hello Bun!"}
```
## 5. 筆記
### 5.1 Record
> Record 是 TypeScipt 中一個 <b>內建泛型工具型別 ( utility type )</b>
用來建立一個對象 ( 物件 ) 型別
這個對象的 <b>鍵 ( key ) 是某個聯合型別</b> ，而 <b>值 ( value ) 是統一的某種型別</b>。

📌 語法：
```ts
Record<Keys, Type>
```
* Keys：鍵的集合，可以是字串、數字或聯合型別。
* Tyoe：所有鍵對應值的型別。
```ts
// 路由表 (key 是路徑，value 是 handler function)
const routes: Record<
    string, 
    (req: Request) => Response | Promise<Response>
> = {
    "/hello": () => {
        return Response.json({ message: "Hello Bun!" })
    }
 };
```
🔍 分析：
> *routes* = 物件 
<table>
    <tr>
        <th>key</th>
        <td>string</td>
    </tr>
    <tr>
        <th>value</th>
        <td>
            function(req: Request) { return Response }
            <br>或<br>
            function(req: Request) { return Promise&lt;Response&gt; }
        </td>
    </tr>
</table>

> 『 &emsp;|&emsp; 』 是 <b>聯合型別 ( Union Type ) </b> 的符號，意思是「可以是其中一種型別」。
```ts
(req: Request) => Response | Promise<Response>
```
是一個<b>函式型別</b>，接收 Request 物件作為參數，並<b>回傳一個</b> Reponse <b>或</b> Promise&lt;Response&gt;
也就是說：
* 這個函式可以<b>同步地</b>回傳一個 Response
* 也可以<b>非同步地</b>回傳一個 Promise&lt;Response&gt; ( 例如用了 async/await )

### 5.2 handleCORS
用來處理 『 OPTIONS 』請求。
```ts
 function handleCORS(req: Request): Response | null {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
        });
    }
    return null;
 };
```
🔍 簡單講：
OPTIONS 是瀏覽器在跨來源請求前，主動發出的「預檢請求 ( preflight request ) 」，用來確認：
> 「這個 API 是否允許我這種跨來源請求？ 」

🧩 所以 handleCORS 裡做了什麼？
1. 辨識這是預檢請求
2. 回傳一個空的 OK 回應 ( 204 No Content )
3. 加上允許跨域的 CORS Header

✅ 這樣的目的：告訴瀏覽器：『 我 ( API本人 ) 是安全的，接收你的跨來源請求。 』

🔁 <b>OPTIONS</b>

OPTIONS 請求是自動發的，通常寫 fetch( ) 不會特別看到，但它會先偷偷送一個
```http
OPTIONS /hello
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```
此時 API 回應：
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type
```
這樣真正的 POST 請求才會發出去。

🧪 用瀏覽器 DevTools 看 OPTIONS 流程
1. 開啟開發者工具
    * 打開瀏覽器
    * 開啟 F12
    * 點到 <b>「Network ( 網路 )」</b> 分頁
2. 做一個跨來源請求
    ( 前提是有一個 <b>API Server 跑在不同 port</b>，例如前端是 5173；後端是 3000 )
    ```js
    fetch("http://localhost:3000/hello", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ hi: "bun" })
    });
    ```
    或是
    ```bash
    curl -X POST http://localhost:3000/hello -H "Content-Type: application/josn" -d '{"hi":"bun"}'
    ```
3. 觀察發生的請求
如果有跨來源，<b>會看到兩個請求出現在 Network 中</b>：
    * 一個是 OPTIONS/hello (預檢)
    * 接下來是 <b>真正的</b> POST/hello ( 如果預檢成功 )


# 建立兩個 serve 互打
## 1. 新增資料夾
<b> 功能清單：</b>
* 建立兩個伺服器，一個在 3000 port，另一個在 4000 port
* 一個伺服器向另一個發出請求

```bash
mkdir serve_a-vs-serve_b
cd serve_a-vs-serve_b
```
## 2. 建立新專案
```bash
bun init -y
```
## 3. 建立 serveA.ts、serveB.ts
<b>3.1 建立 serverA.ts (Port 3000)</b>

```ts
Bun.serve({
    port: 3000, 
    fetch(req) {
        return new Response("Hello from Server A on prot 3000");
    }
});
console.log("Server A running on http://localhost:3000");
```
<b>3.2 建立 serverB.ts (Port 4000) 向 Server A 發出請求</b>

```ts
Bun.serve({
    port: 4000,
    async fetch(req) {
        const responseFromA = await fetch("http://localhost:3000");
        const text = await responseFromA.text();
        return new Respones("Server B got response from A: " + text);
    }
});
console.log("Server B running on http://localhost:4000");
```
## 4. 執行
開兩個 terminal：
```bash
bun serveA.ts
```
```bash
bun serveB.ts
```
接著用瀏覽器或 curl 訪問 http://localhost:4000，就會看到它從 3000 拿到訊息

# 聊天室
<b> 功能清單：</b>
* 建立一個伺服器，用來接收請求 (留言)，整理完 (留言累加) 再回傳
* 建立 html 聊天室介面，發送請求給伺服器，取得回傳留言以區分是自己的留言還是別人的

## 1. 新增資料夾
```bash
mkdir chat-room
cd chat-room
```
## 2. 建立新專案
```bash
## 新增 index.ts
bun init -y
## 新增 index.html
echo "" > index.html
```
## 3. index.ts
> 功能：
> * 伺服器 port 3000
> * 處理請求內容
> * 回傳資料 json {"self": [留言], "other": [留言]}

## 4. index.html
> 功能：
> * 設計介面：顯示所有留言視窗、留言輸入框、發送按鈕
> * 自訂使用者pk
> * 輸入留言後點擊發送按鈕：
    1. 帶著自己的pk和留言向伺服器發送請求
    2. 取得回傳資料，分辨是自己的留言還是別人的，重新渲染留言視窗
> * 當輸入框為空，發送按鈕不開放點擊

