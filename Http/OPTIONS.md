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
> 逐行分析
*   <b>HTTP/1.1 200 OK</b>
    是一個 HTTP 回應狀態碼，表示請求已成功處理並返回所需的結果。
    *   <b>HTTP/1.1</b>
        指的是使用的 HTTP 協定版本。 `1.1` 是目前最常用的版本。
    *   <b>200</b>
        這是對狀態碼的文字描述，表示一切正常
    *   <b>HTTP 協定版本</b>
        HTTP 協議版本之間的差異主要體現在性能、功能、連接管理以及如何處理請求和響應等方面。
        
        <b>🌐 HTTP/0.9</b>
        *   <b>發佈時間：</b>1991年
        *   <b>✅ 特色: </b>
            * <b>極簡設計: </b> 只有 GET 方法，連 Header 都沒有
            * <b>純文字傳輸: </b> 只能傳送純 HTML，不支援圖片、樣式、腳本等
            * <b>回應無狀態: </b> 伺服器只回傳 HTML 本體，不會標明檔案格式或狀態碼。
        *   <b>❌ 缺點：</b>
            * <b>無法處理多媒體與複雜應用</b>
            * <b>不支援狀態碼</b> ( 如200、404 )、Header、內容類型等功能。
            * 現在但瀏覽器與伺服器已不再支援。

        <b>🌐 HTTP/1.0</b>
        *   <b>發佈時間：</b>1996年
        *   <b>✅ 特色: </b>
            * <b>引入 Header: </b> 可傳送 MIME類型 ( 如 Content-Type )、狀態碼、User-Agent等
            * <b>支援其他方法: </b> 如 POST、HEAD。
            * <b>初步支援快取控制: </b> 如 Expires、Last-Modified。
        *   <b>❌ 缺點：</b>
            * <b>非持久連線: </b> 每次請求都會重新建立並關閉 TCP 連線（開銷大）。
            * <b>不支援虛擬主機 (Host Header)</b>，同一IP無法區分不同網站。
            * 不支援管線化或併發請求，導致多資源載入時效能差。
        * <b>🛠️ 建立並關閉 TCP 連線的開銷: </b>
            每次請求都重新建立並關閉 TCP 連線，會產生較大的 <b>開銷 (Overhead)</b>，主要原因如下:

            ✅ <b>1. TCP 三次握手 (Three-Way Handshake)</b>
            
            每次建立連線都需經過三次握手：
            * 客戶端發送 SYN
            * 伺服器回應 SYN-ACK
            * 客戶端再回 ACK

            👉 這三個封包需要耗費時間與資源，即使資料還沒正式開始傳輸，也消耗了網路延遲和 CPU 處理成本。

            ✅ <b>2. TCP 四次揮手 (Four-Way Handshake)</b>

            斷開連線時，還需要四次揮手來釋放資源，過程中: 
            * 需要管理連線狀態 (如 TIME_WAIT)
            * 系統資源 (如 socket、記憶體)會暫時被占用

            ✅ <b>3. 慢啟動 ( TCP Slow Start )</b>
            TCP 用來<b>避免網路壅塞</b>的壅塞控制機制。
            主要目的是在連線當建立時，<b>避免一次傳送太多資料而導致網路負載過重</b>。
            * 防止新連線一開始就占用大量頻寬。
            * 自動調整至網路能承受的速度，減少封包丟失。
            每次建立新連線，TCP 會從一個很小的傳送速度開始傳送資料，再慢慢增速 (視情況調整)
            
            <b>如果 TCP 連線頻繁地重新連線並斷開</b>
            永遠處於慢啟動階段，無法達到最佳傳輸速度
            👉 因此短時間的傳輸效能會變差。

            ✅ <b>4. 缺乏連線重用</b>

            如果每個 HTTP 請求都新開 TCP：
            * 伺服器需同時處理大量連線建立與釋放，耗費CPU與記憶體，還容易觸發防火牆、反爬蟲或連線速率限制等安全機制。

            * <b>無法使用 TCP 的一些優化機制</b>
            像是 TCP 的「快啟動 (TCP Fast Open)」、「壅塞控制記憶 (如 TCP BBR)」 、TCP快取、TLS session resumption 等機制都需要連線持久性才能發揮作用。
        
        <b>🌐 HTTP/1.1</b>
        *   <b>發佈時間：</b>1997年
        *   <b>✅ 特色: </b>
            * <b>持久連線 (Keep-Alive):</b> 連線可重用，節省 TCP 建立開銷
            * <b>Host Header 支援虛擬主機:</b> 同一IP可服務多個網站。
            * <b>Cache 控制增強: </b> 如 `ETag`、`Cache-Control`
            * <b>支援分段傳輸 (Chunked Transfer Encoding):</b> 可在傳送過程中逐漸生產資料。
            * <b>帶寬節省: </b> 支援 `Range` 請求，下載部分檔案，例如下在大文件時，只需下載需要的部分。
            * <b>理論支援管線化 (Pipelining): </b> 可連續發送請求，不等回應。
        *   <b>❌ 缺點: </b>
            * <b>Head-of-Line Blocking (隊頭阻塞): </b> 即使支援管線化，伺服器也必須依序回應，後面的請求會卡住。
            * 管線化在實務上不穩定，瀏覽器多數已關閉。
            * 多資源 ( 圖片、CSS ) 需多條連線才流暢 (通常開多個 TCP 連線)，浪費資源。
        *   <b>持久連線 Keep-Alive</b>
            讓同一 TCP 連線可重複使用來傳輸多個 HTTP 請求與回應。
            <b>🔧 運作流程：</b>
            1. <b>客戶端發起 TCP 連線</b>
                → 和伺服器建立一條 TCP 連線
            2. <b>發送第一個 HTTP 請求</b>
                → 含 `Connection: keep-alive` 標頭 (HTTP/1.1可省略，預設為keep-alive)。
            3. <b>伺服器回應請求</b>
                → 回應中包含 `Connection: keep-alive` 表示支援持久連線。
            4. <b>TCP 連線保持開放</b>
                → 不立即關閉，等待後續請求。
            5. <b>客戶端重用連線發送後續請求</b>
                → 如果有更多資源需要請求 (例如圖片、CSS、JS等)，直接透過同一條TCP連線傳送。
            6. <b>連線閒置時伺服器啟動超時計時</b>
                → 若一段時間 (如5秒、60秒)類沒有新請求，伺服器會主動關閉這條 TCP 連線，釋放資源。
            7. <b>連線關閉 (可由任一方關閉)</b>
                → 若客戶不再使用，可以主動發送 `Connection: close`；伺服器也可以因為閒置超時而斷開。
        *   <b>Host Header 支援虛擬主機</b>