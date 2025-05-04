## 🌐 TCP 連線的唯一標識：四元組
TCP 是透過一組「四元組 ( <b>4-tuple</b> )」來唯一識別：
1. <b>來源IP位址</b> (Client IP)
2. <b>來源埠號</b> (Client Port) (動態指派)
3. <b>目的IP位址</b> (Server IP)
4. <b>目的埠號</b> (Server Port)

<b>🧠 作業系統如何追蹤 TCP 連線</b>
1. <b>每條連線都在系統中登記</b>
    * 當 TCP 三次握手完成後，作業系統會在記憶體中建立一筆連線紀錄，通常稱為 <b>socket 資料結構</b> 或 <b>連線表項目</b>。
    * 每筆記錄都包含四元組(source IP, source port, dest IP, dest port) 以及連線狀態。
2. <b>使用 socket 物件管理連線</b>
    * 應用程式 (如 Web Server) 使用系統提供的 <b>socket API</b> (如 `accept()`、`read()`、`write()`)來處理每一條 TCP 連線。
    * 每個 socket 都會對應到一條唯一的 TCP 連線
3. <b>連線狀態追蹤 (TCP狀態機)</b>
    * 系統會追蹤每條連線目前的狀態 (如 `ESTABLISHED`、`TIME_WAIT`、`CLOSE_WAIT`等)，這稱為<b>TCP狀態機(TCP State Machine)</b>。
    * 狀態變化來自於封包的收發，例如接收到 `FIN`就進入關閉階段。

## 🌐 TCP 狀態機總覽
TCP 的狀態大致可分為3個階段：
1. <b>連線建立階段</b>
2. <b>資料傳輸階段</b>
3. <b>連線關閉階段</b>

各階段的流程順序：
1.  `LISTEN`
    伺服器端在等待連線 (例如呼叫 `listen()`之後)。
2.  `SYN_SENT`<b>(第一次握手)</b> 
    客戶端發出連線請求(SYN)，等待回應中。
    * 客戶端發送一個 SYN 報文(SYN=1，序列號為seq=x)，表示希望建立連線。
    * 客戶端進入 <b>SYN_SEND</b> 狀態。
3.  `SYN_RECEIVED`<b>(第二次握手)</b> 
    伺服器收到 SYN ，回傳 SYN+ACK ，等待客戶端 ACK 。
        伺服器收到 SYN 報文後，回應一個報文：
        * SYN=1 表示同意連線
        * ACK=1 ，確認號 ack=x+1，表示收到客戶端的 SYN
        * 同時發送自己的 SYN，seq=y
        伺服器進入 <b>SYN_RECEVIED</b> 狀態。
4. `ESTABLISHED`<b>(第三次握手)</b>
    <b>雙方完成三次握手，連線建立完成，可以傳送資料。</b>
        客戶端收到伺服器的 SYN+ACK 報文後，發送一個 ACK 報文：
        * ACK=1，ack=y+1，確認收到伺服器的 SYN。
        客戶端進入 <b>ESTABLISHED</b> 狀態。
        伺服器收到 ACK 後，也進入 <b>ESTABLISHED</b> 狀態，連線建立成功。
5. `FIN_WAIT_1`<b>(第一次揮手)</b>
    主動關閉連線方送出 FIN ，等待對方 ACK。
        客戶端發送一個 <b>FIN</b> 報文：
        * FIN=1，seq=x
        * 表示"我已經沒有數據要發送了，但我仍能接收數據"。
        客戶端進入 <b>FIN_WAIT_1</b> 狀態。
6. `FIN_WAIT_2`<b>(第二次揮手)</b>
    收到對方 FIN，發送 ACK，等待對方的 FIN。
        伺服器收到 <b>FIN</b>後，發送一個 <b>ACK</b>報文：
        * ACK=1, seq=x+1
        伺服器進入 <b>CLOSE_WAIT</b> 狀態
        客戶端收到 <b>ACK</b> 後，進入 <b>FIN_WAIT_2</b> 狀態。
7. `CLOSE_WAIT`
    被關閉連線方收到 FIN，尚未送出自己的 FIN。
8. `LAST_ACK`<b>(第三次揮手)</b>
    被關閉連線方送出 FIN，等待對方 ACK (最後一個ACK)。
    *  當伺服器數據發送完畢後，發送一個 <b>FIN</b> 報文：
       *  FIN=1, ACK=1；seq=y；ack=x+1
9. `TIME_WAIT`
    主動關閉連線方收到最後 ACK 後，進入等待 (通常 2 倍最大封包壽命，常見為60秒或2分鐘)。目的是避免舊封包影響新連線。
10. `CLOSED`
    連線完全結束，系統回收資源。
        客戶端收到 <b>FIN</b> 後，發送一個 <b>ACK</b> 報文作為確認：
        * ACK=1；seq=x+1；ack=y+1
        客戶端進入 <b>TIME_WAIT</b> 狀態 (持續約2倍最大報文生存時間MSL)
        伺服器端收到 ACK 後，連線正式關閉。
        客戶端等待一段時間後，也進入 <b>CLOSED</b> 狀態。

✅ TCP 三次握手（建立連線）
| 步驟        | 發送方 → 接收方 | 標誌位      | 序列號（seq）    | 確認號（ack）    | 說明 |
| --------- | --------- | -------- | ----------- | ----------- | -------------- |
| 1️⃣ 第一次握手 | 客戶端 → 服務端 | SYN      | `seq = x`   | —           | 客戶端請求連線        |
| 2️⃣ 第二次握手 | 服務端 → 客戶端 | SYN, ACK | `seq = y`   | `ack = x+1` | 服務端同意連線，確認 x   |
| 3️⃣ 第三次握手 | 客戶端 → 服務端 | ACK      | `seq = x+1` | `ack = y+1` | 客戶端確認 y，連線建立完成 |
✅ TCP 四次揮手（斷開連線）
| 步驟        | 發送方 → 接收方 | 標誌位      | 序列號（seq）    | 確認號（ack）    | 說明          |
| --------- | --------- | -------- | ----------- | ----------- | ----------------------- |
| 1️⃣ 第一次揮手 | 客戶端 → 服務端 | FIN      | `seq = x`   | —           | 客戶端要求關閉連線   |
| 2️⃣ 第二次揮手 | 服務端 → 客戶端 | ACK      | `seq = y`   | `ack = x+1` | 確認收到 FIN，進入 CLOSE\_WAIT |
| 3️⃣ 第三次揮手 | 服務端 → 客戶端 | FIN, ACK | `seq = y+1` | `ack = x+1` | 服務端也發出 FIN  |
| 4️⃣ 第四次揮手 | 客戶端 → 服務端 | ACK      | `seq = x+1` | `ack = y+2` | 客戶端確認 FIN，進入 TIME\_WAIT |

## 🌐 觀察TCP
### Windows 環境
<b>✅ 方法一：使用 Wireshark（圖形介面，最推薦）</b>

<b>🔧 安裝與操作步驟：</b>

1. <b>下載與安裝 Wireshark</b>
    *   官方網站：<a href="https://www.wireshark.org" style="text-decoration: none;">https://www.wireshark.org</a>