## Record
Record 是 TypeScript 中的一個<b>內建泛型工具型別 ( utility type )</b>，
它的作用是用來建立一個對象 ( 物件 ) 型別，
這個對象的 <b>鍵 ( key ) 是某個聯合型別</b> ，而 <b>值 ( value ) 是統一的某種型別</b> 。

📌 語法：
```ts
Record<Keys, Type>
```
* Keys：鍵的集合，可以是字串、數字或聯合型別。
* Type：所有鍵對應的值的型別。

✅ 範例一：基本用法
```ts
type Role = 'admin' | 'user' | 'guest';
const permissions: Record<Role, string[]> = {
    admin: ['read', 'write', 'delete'],
    user:  ['read', 'write'],
    guest: ['read']
};
```
這裡 permissions 的鍵只能是 'admin' 、 'user' 或 'guest' ， 每個值都是 string[]

✅ 範例二：搭配字串與物件
```ts
type PageInfo = {
    title: string;
};

type Pages = 'home' | 'about' | 'contact';

const pageInfo: Record<Pages, PageInfo> = {
    home: {title: 'Home Page'},
    about: {title: 'About Us'},
    contact: {title: 'Contact Us'},
};
```
🔁 等價型別寫法（手動）
```ts
type PageInfoMap = {
    home: PageInfo;
    about: PageInfo;
    contact: PageInfo;
};
```
這樣寫起來冗長，但 Record 幫你簡化了。

🧠 實用場合
* 對應不同狀態或角色的資料
* 根據某個固定集合建立物件的模板
* 搭配 enum 使用也很常見

## 💼 實際專案場景
> 報表狀態顯示文字

🎯 場景
你有一個報表系統，報表有幾種狀態：
* assigned：已派送
* in_progress：製作中
* completed：已完成
* rejected：被退回

你希望根據這些狀態，對應顯示不同的中文字給使用者看。
```ts
// test-record.ts
type ReportStatus = 'assigned' | 'in_progress' | 'completed' | 'rejected';

const statusLabels: Record<ReportStatus, string> = {
    assigned: '已派送',
    in_progress: '製作中',
    completed: '已完成',
    rejected: '被退回'
};

function getStatusLable(status: ReportStatus): string {
    return statusLabels[status];
}

console.log(getStatusLabel('in_progress'));
```