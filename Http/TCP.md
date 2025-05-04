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

<b>1. 下載與安裝 Wireshark</b>
    官方網站：<a href="https://www.wireshark.org" style="text-decoration: none;">https://www.wireshark.org</a>
    <div style="display: grid; font-weight: bolder;">
        <details>
            <summary style="cursor: pointer;">安裝步驟(圖示)</summary>
            1. 進入 Wireshark 官網，選擇【 Download 】
            <img style="width: 50%;" src="./img/TCP_1.png" title="1">
            2. 選擇 Windows x64
            <img style="width: 50%;" src="./img/TCP_2.png" title="2">
            3. 點選 Wireshark.exe 開始安裝
            <img style="width: 50%;" src="./img/TCP_3.png" title="3">
            <img style="width: 50%;" src="./img/TCP_4.png" title="4">
            <img style="width: 50%;" src="./img/TCP_5.png" title="5">
            <img style="width: 50%;" src="./img/TCP_6.png" title="6">
            <img style="width: 50%;" src="./img/TCP_7.png" title="7">
            <img style="width: 50%;" src="./img/TCP_8.png" title="8">
            <img style="width: 50%;" src="./img/TCP_9.png" title="9">
            <img style="width: 50%;" src="./img/TCP_10.png" title="10">
            <img style="width: 50%;" src="./img/TCP_11.png" title="11">
            <img style="width: 50%;" src="./img/TCP_12.png" title="12">
            <img style="width: 50%;" src="./img/TCP_13.png" title="13">
            <img style="width: 50%;" src="./img/TCP_14.png" title="14">
            <img style="width: 50%;" src="./img/TCP_15.png" title="15">
            <img style="width: 50%;" src="./img/TCP_16.png" title="16">
            <img style="width: 50%;" src="./img/TCP_17.png" title="17">
            <img style="width: 50%;" src="./img/TCP_18.png" title="18">
            <img style="width: 50%;" src="./img/TCP_19.png" title="19">
            <img style="width: 50%;" src="./img/TCP_20.png" title="20">
        </details>
    </div>

<b>2. 執行 Wireshark</b>
*   以 <b>系統管理員身分</b> 啟動 (否則可能無法擷取網路介面)

<b>3. 選擇你的網路介面卡(例如: Ethernet、 Wi-Fi)</b>
*   滑鼠右鍵選擇`Start capture`
<img style="width: 50%;" src="./img/TCP_21.png" title="21">
*   開始抓取封包
<img style="width: 50%;" src="./img/TCP_22.png" title="22">

<hr>

<b>✅ 方法二：使用 Windows 命令列工具 `netsh trace` (進階)</b>
這是 Windows 內建的封包擷取工具，可以抓完整用Wireshark開啟分析

<b>檢查 netsh：</b>
<b>方法 1：通過命令提示符檢查</b>
```cmd
netsh
如果顯示 netsh 的命令行介面，說明 netsh 已經安裝並可用
Microsoft (R) Windows (R) Command Shell
Copyright (C) Microsoft Corporation. All rights reserved.

netsh>
```

<b>方法 2：查看系統環境變數</b>
`netsh` 工具是 Windows系統自帶的，應位於 `C:\Windows\System32\netsh.exe`

<b>方法 3：使用 PowerShell</b>
```powershell
Get-Command netsh
```

<hr>

<b>netsh 封包擷取操作步驟：</b>

<b>開始封包擷取</b>
```powershell
netsh trace start capture=yes tracefile=c:\temp\trace.etl
```
這是用來啟動 Windows 系統中的網路追蹤 (Network Trace) 功能，並將捕獲的網路數據保存到指定檔案中。
*   `netsh`: 是 Windows 用於配置和管理網路設定的命令行工具
*   `trace start`: 表示啟動網路追蹤功能
*   `capture=yes`: 表示啟動數據包捕獲
*   `tracefile=c:\temp\trace.etl`: 這指定了追蹤結果儲存的檔案位置，c:\temp\trace.etl 是儲存檔案的路徑和檔名。

<b>⚠️ 如果要停止捕捉</b>
```powershell
netsh trace stop
```

<hr>

<b>✅ 方法三：使用 Windows 命令列工具 `netstat`快速觀察 TCP 連線狀態 (不顯示握手細節)</b>

`netstat` 會顯示當下的 <b>網路狀態快照</b>
也就是目前的 <b>TCP/UDP連線、端口、路由表</b>等資料。
它會在執行命令的那一刻顯示目前的網路狀態，而不是持續運行。

<b>一次性顯示網路狀態</b>
```bash
netstat -an
# 列出所有當前的網路連線、端口、狀態
```
<b>持續性顯示網路狀態 ( 每 5 秒更新一次 ) </b>
```bash
for /L %i in () do netstat -an & timeout /t 5
# 可以用 Ctrl+C 停止
```
<b>觀察指定 IP 網路狀態</b>
```bash
netstat -an | find "192.168.1.10"
```

<b>觀察指定 IP 網路狀態 ( 每 5 秒更新一次 )</b>
```bash
for /L %i in () do netstat -an | find "192.168.1.10" & timeout /t 5
```

<b>觀察指定 port 網路狀態</b>
```bash
netstat -an | find ":80"
```

<b>觀察指定 port 網路狀態 ( 每 5 秒更新一次 )</b>
```bash
for /L %i in () do netstat -an | find ":80" & timeout /t 5
```

<hr>

## Npcap
Npcap 是一個 <b>網路封包捕捉驅動程式 ( packet capture driver )</b>
它允許應用程式攔截和傳送網路封包，是在 Windows 上進行低階網路分析和監控的關鍵工具之一。
它是由 <b>Nmap 項目</b>開發的，用來取代舊的 <b>WinPcap</b> 驅動程式，並解決其兼容性與安全性問題。

### <b>🔧 Npcap 的用途</b>
*   <b>網路封包擷取 ( Packet sniffing )</b>：例如使用 Wireshark來分析網路流量。
*   <b>網路監控與安全分析</b>：用來入侵檢測系統、流量監控等工具。
*   <b>開發網路工具</b>：例如 Nmap、Scapy、Npcap SDK 開發的自定應用。
*   <b>發送自定義封包</b>：可模擬協定、測試防火牆規則等。

<hr>

### <b>🆚 Npcap vs WinPcap</b>
| 功能比較           | Npcap                   | WinPcap                     |
| -------------- | ----------------------- | --------------------------- |
| 開發者            | Nmap Project            | Riverbed（舊為 CACE）           |
| 系統支援           | Windows 7 \~ Windows 11 | Windows XP \~ Windows 7（過時） |
| 兼容性            | 與 WinPcap 相容            | 舊版應用正常運行                    |
| 支援 802.11 WiFi | ✅ 支援（需安裝特殊模式）           | ❌ 不支援                       |
| 性能與安全性         | 更高、更安全                  | 已不再維護                       |

<hr>

### <b>⚙️ 安裝選項（常見）</b>
*   <b>Install Npcap in WinPcap API-compatible Mode</b>：
    允許舊程式繼續使用原本的 WinPcap API
*   <b>Support loopback traffic ("Npcap Loopback Adapter")</b>：
    可擷取畚箕傳送給自己的流量。
*   <b>Support raw 802.11 traffic for wireless adapters</b>：
    允許擷取 WiFi 封包 (不是所有網卡支援)。
<img style="width: 50%;" src="./img/TCP_14.png" title="14">

<hr>

### <b>🔒 授權模式</b>
*   <b>免費授權 ( Non-Commercial Use Only)</b>：
    適用於個人學習、研究用途。
*   <b>商業授權 ( Non-Commercial Use Only)</b>：
    企業使用需購買授權。

### 🧪 Npcap 驅動操作

<b>✅ 測試是否安裝成功</b>

```bash
sc query npcap
若顯示 STATE: RUNNING ，表示 Npcap 驅動成功運行中。
```

<b>✅ 查看 Npcap 狀態</b>

```bash
sc query npcap
輸出會顯示 STATE
```
*   `RUNNING`：表示目前已啟動
*   `STOPPED`：表示目前已停止

<b>▶️ 手動啟動 Npcap</b>
```cmd
sc start npcap
```

<b>⏹️ 手動停止 Npcap</b>
```cmd
sc stop npcap
```
⚠️ 注意：如果有程式正在使用 Npcap（如 Wireshark、Nmap 等），你可能無法停止它，或者會失敗。

<b>🔒 需管理員權限！</b>
這些操作必須以「系統管理員身份執行」命令提示字元或 PowerShell。

<b>🧠 延伸補充：Npcap Loopback Adapter</b>
如果你看到「Npcap Loopback Adapter」裝置，它是一個虛擬的網卡，專門讓你擷取本機傳送給自己的流量。這個也可以透過裝置管理員啟用／停用。

<hr>

### 😱 Npcap 一直開著會不會耗CPU效能?
一般情況下，<b>Npcap 常駐 (驅動一直啟用)幾乎不會耗用任何顯著的 CPU 或系統效能</b>。

<b>✅ 為什麼 Npcap 不會持續耗用資源？</b>
*   Npcap 是一個 <b>passive driver (被動驅動)</b>
    它不會主動做事，只是等待應用程式 (如 Wireshark) 來「呼叫」它擷取封包。
*   沒有任何程式使用 Npcap 時，它處於 <b>空閒狀態</b>，不會分析、紀錄或轉送任何封包。
*   它不像某些防毒或網路監控工具會「持續掃描」，Npcap 完全不主動處理流量。

<b>⚠️ 什麼情況下會造成資源使用？</b>
*   <b>有程式啟動了封包擷取 (如 Wireshark、Nmap、 Snort等)</b>
    * 在進行封包擷取時，Npcap就會開始將封包傳給程式處理，這可能佔用一點 CPU，尤其在高流量環境。

*   <b>寫了自己使用 Npcap 的應用程式(使用libpcap/Npcap SDK)</b>
    *   持續開啟介面抓封包，會產生系統負擔。