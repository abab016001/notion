<b>✅ 業界常見的資料匯入方式</b>
| 類型          | 工具或方式                                 | 適用情境                           |
| ----------- | ------------------------------------- | ------------------------------ |
| 📦 一次性大量匯入  | `mongoimport`, `mongoose.bulkWrite()` | 從 CSV、JSON 等批次導入資料庫（ex: 初始化系統） |
| 🔄 定時自動匯入   | 使用排程器（如 `cron` + node 腳本）             | 每日自動匯入報表、第三方資料                 |
| 🌐 API 接收   | REST/GraphQL + 後台 admin 操作            | 讓使用者匯入資料，並由後端驗證與儲存             |
| 📋 管理系統匯入   | 後台提供上傳功能（CSV / Excel）                 | 可由非工程師操作上傳資料                   |
| ☁️ ETL 工具   | Airbyte、Apache NiFi、Pentaho 等         | 複雜資料流處理、跨系統搬資料                 |
| 🧪 測試用假資料工具 | Faker.js、Mockaroo                     | 自動產生符合邏輯的假資料（模擬真實使用）           |

## ✅ 1. 從 CSV 匯入資料到 MongoDB

<b>需要的工具</b>
*   csv-parser 或 papaparse 用來解析 CSV 檔案
*   mongoose 用來操作 MongoDB

<b>安裝必要的套件</b>

```bash
npm install mongoose csv-parser
```

<b>範例：從 CSV 匯入資料到 MongoDB</b>

```csv
name,age,email
張三,25,zhangsan@example.com
李四,30,lisi@example.com
王五,22,wangwu@example.com
``` 