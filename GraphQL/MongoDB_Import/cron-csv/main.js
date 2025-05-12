const cron = require('node-cron');
const mongoose = require('mongoose');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

// 1. 建立 MongoDB
mongoose.connect("mongodb://localhost:27017/crondb");

// 2. 建立 Schema
const Report = mongoose.model("Report", new mongoose.Schema({
    '年度': String,
    '現金股利（元/股）': Number,
    '股票股利（元/股）': Number,
    '股利合計（元/股）': Number,
    '現金股利（億元）': Number,
    '持股比率（%）': Number,
    '發行公司': String
}));

// 每 5 分鐘 [*/5 * * * *]

// 計算下一個五分鐘
const getNextRunTime = () => {
    const now = new Date();
    const ms = 1000 * 60 * 5; // 五分鐘
    return new Date(Math.ceil(now.getTime() / ms) * ms);
};

let nextRunTime = getNextRunTime();
let isRunning = false;

cron.schedule('*/5 * * * *', async () => {
    if (isRunning) {
        console.log("上個排程還沒結束，不跑這次排程");
        return;
    }
    
    isRunning = true;
    console.log(`✅ 任務執行於：${new Date().toLocaleString()}`);
    nextRunTime = getNextRunTime(); // 更新下一次執行時間

    // 模擬下載 CSV 
    const url = 'https://data.taipei/api/dataset/abbf2c06-ead6-46c5-97ba-e5e8400368f7/resource/477016da-fd31-453d-bed5-030092329714/download';
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(csv())
        .on("data", async (row) => {
            const report = new Report({
                '年度': String(row['年度']),
                '現金股利（元/股）': Number(row['現金股利（元/股）']),
                '股票股利（元/股）': Number(row['股票股利（元/股）']),
                '股利合計（元/股）': Number(row['股利合計（元/股）']),
                '現金股利（億元）': Number(row['現金股利（億元）']),
                '持股比率（%）': Number(row['持股比率（%）']),
                '發行公司': String(row['發行公司'])
            });
            await report.save();
            // console.log(row);
        })
        .on("end", async () => {
            console.log("匯入完成");
            isRunning = false;
        })
});

setInterval(() => {
    const now = new Date();
    const diff = Math.floor((nextRunTime - now) / 1000); // 秒數

    if (diff >= 0) {
        console.log(`⏳ 距離下次執行還有 ${diff} 秒`);
    }
}, 1000);