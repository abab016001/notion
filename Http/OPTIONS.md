# OPTIONS
HTTP `OPTIONS` 是一種 HTTP 請求方法，主要用來查詢目標伺服器的功能，或查看特並資源的允許操作。
當客戶端發送 `OPTIONS` 請求時，伺服器會回傳一個響應，告訴客戶它可以對該資源進行哪些操作。

常見的用途有：

### 1. 查詢伺服器支持的HTTP方法
客戶端可以通過發送 `OPTIONS` 請求，了解伺服器是否支援某些 HTTP 方法(如 GET、POST、PUT、DELETE等)。伺服器會在 `Allow` 標頭中返回所有支持的方法。
例如：
```http
OPTIONS /example HTTP/1.1
Host: example.com
```
伺服器可能的回應：
```http
HTTP/1.1 200 OK
Allow: GET, POST, OPTIONS
```
### 2. CORS (跨來源資源共享)
在瀏覽器進行跨域請求時，瀏覽器會發送一個 `OPTIONS` 請求，
這是預檢請求 (preflight request)。
瀏覽器用此方法來確定伺服器是否允許某些跨域請求。這通常在發送實際的 `POST`、`PUT` 或其他改變數據的請求之前進行。

### 3. 輔助調試和自動化
在某些情況下，開發者使用 OPTIONS 來檢查伺服器的功能，或者確定如何使用 HTTP 請求與伺服器進行交互。

<b>OPTIONS 預檢請求</b>
1. 當瀏覽器發送如 POST、PUT 或包含自訂標頭的請求時，它會先發送一個 OPTIONS 預檢請求，詢問伺服器是否允許這些操作。
2. 伺服器接收到 OPTIONS 請求後，會回應 CORS 相關的標頭，來告訴瀏覽器它是否允許跨域請求。

<b>OPTIONS 預檢請求範例</b>

1. 客戶端進入網頁 http://example-frontend.com
2. 點選網頁的按鈕，呼叫 http://example.com/api/resource
3. 按鈕是來自於 http://example-frontend.com，
所以是 http://example-frontend.com 呼叫 http://example.com/api/resource
4. http://example-frontend.com 先發出預檢請求給 http://example.com/api/resource
```http
OPTIONS /api/data HTTP/1.1
Host: api.example.com
Origin: http://example-frontend.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```
> 我是『http://example-frontend.com』
  我可以用 POST 帶 Content-Type 標頭訪問你 (http://example.com/api/resource) 嗎❤️?
5. 對方(http://example.com/api/resource) 回應預檢請求
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://example-frontend.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```
> 🆗 是你(http://example-frontend.com) 喔  OK啊
  🆗 用POST可以，用GET, OPTIONS也行~
  🆗 可以用 Content-Type 標頭
  🆗 可以帶 cookie 或其他憑證 (Access-Control-Allow-Credentials: true)
  ✔️ 24小時內可以不用再發預檢請求給我了 (Access-Control-Max-Age: 86400)

6. 發送實際請求
```http
POST /api/data HTTP/1.1
Host: api.example.com
Origin: http://example-frontend.com
Content-Type: application/json
Cookie: session=abc123

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

7. 對方回應
```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://example-frontend.com
Access-Control-Allow-Credentials: true

{
  "status": "success",
  "message": "資料已接收"
}
```

> 客戶端發送請求給伺服器：
```http
OPTIONS /api/resource HTTP/1.1
Host: example.com
Origin: http://example-frontend.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, X-Custom-Header
```
* <b>Origin: </b>
  紀錄發出請求的源（即網頁所在的域名）。
* <b>Access-Control-Request-Method: </b>
  紀錄發出請求的源（即網頁所在的域名）。
* <b>Access-Control-Request-Headers: </b>
   列出隨請求一起發送的自訂標頭（例如 Content-Type 或 X-Custom-Header）。

想要檢測目標Server支持哪些請求方法
> 可以用 curl 來發出 OPTIONS 請求
```bash
curl -X OPTIONS https://www.w3schools.com -i
```
> 回傳資訊
```https
HTTP/1.1 200 OK
Content-Length: 0
Allow: OPTIONS, TRACE, GET, HEAD, POST
Public: OPTIONS, TRACE, GET, HEAD, POST
Content-Security-Policy: frame-ancestors 'self' https://mycourses.w3schools.com https://pathfinder.w3schools.com;
X-Content-Security-Policy: frame-ancestors 'self' https://mycourses.w3schools.com https://pathfinder.w3schools.com;
Expires: Sun, 27 Apr 2025 08:01:51 GMT
Cache-Control: max-age=0, no-cache, no-store
Pragma: no-cache
Date: Sun, 27 Apr 2025 08:01:51 GMT
Connection: keep-alive
```
