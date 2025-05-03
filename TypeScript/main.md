## 如何執行.ts檔
要執行 .ts ( TypeScript ) 檔案，通常需要先將它編譯成 JavaScript，然後再執行。
不過也可以用工具直接執行。下方是兩種常見方式：

✅ 方法一：使用 ts-node 直接執行

<b> 1. 安裝 TypeScript 和 ts-node (若尚未安裝)：</b>
```bash
npm install -g typescript ts-node
```
<b> 2. 執行 .ts 檔案：</b>
```bash
ts-node yourfile.ts
```

✅ 方法二：先編譯再執行
這種方法更像是正是佈署用的做法

<b>1. 安裝 TypeScript (若尚未安裝)</b>
```bash
npm install -g typescript
```
<b>2. 編譯 .ts 檔案</b>
```bash
tsc yourfile.ts
```
這樣會產生一個 yourfile.js 檔案

<b>3. 使用 Node.js 執行編譯後的 .js 檔案</b>
```bash
node yourfile.js
```

### [Record](mds/TS-Record.md)