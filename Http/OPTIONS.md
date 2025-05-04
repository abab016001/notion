# OPTIONS
<b>OPTIONS 預檢請求</b>
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
