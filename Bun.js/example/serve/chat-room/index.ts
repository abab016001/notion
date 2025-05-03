Bun.serve({
    port: 3000,
    async fetch(req: Request) {
        console.log(req);
        
        // 預檢處理 OPTIONS
        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            });
        }

        // 處理實際請求
        if (req.method === "POST") {
            const data = await req.json();
            console.log("接收到資料:", data);

            return new Response(JSON.stringify({ message: "test" }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        return new Response("NOT FOUND 404", {status: 404});
    }
});
console.log("Server runniing on http://localhost:3000");