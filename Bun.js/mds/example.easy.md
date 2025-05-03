/example/easy
# Hello API
<b>目標 : </b>建立一個簡單 API Server
<b>功能 : </b>/hello : 回傳JSON { message: "Hello Bun!" }

## 1. 初始化專案
```powershell
bun init
```
## 2. 建立伺服器檔案
```ts
// index.ts
import { serve } from "bun";

serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/hello") {
            return Response.json({ message: "Hello Bun!" });
        }

        return new Response("Not Found", { status: 404 });
    }
})

console.log(`Server running at http://localhost:${server.port}`);
```
## 3. 執行伺服器
```powershell
bun index.ts
```
就會看到
```bash
Listening on http://localhost:3000
```
## 4. 測試 <code>/hello</code>
```bash
curl http://localhost:3000/hello
```
輸出應為
```json
{ "message": "Hello Bun!" }
```