import { serve } from 'bun';

// 路由表 (key 是路徑，value 是 handler function)
const routes: Record<
    string, 
    (req: Request) => Response | Promise<Response>
> = {
    "/hello": () => {
        return Response.json({ message: "Hello Bun!" })
    },
};

// 處理 CORS
function handleCORS(req: Request): Response | null {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POSE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        })
    }

    return null;
}

// 服務
const server = serve({
    port: 3000,
    fetch(req: Request): Response |Promise<Response> {
        const cors = handleCORS(req);
        if (cors) return cors;

        const url = new URL(req.url);
        const handler = routes[url.pathname];

        if (handler) {
            const res = handler(req);
            // 加上 CORS headers
            return Promise.resolve(res).then((response) => {
                response.headers.set("Access-Control-Allow-Origin", "*");
                return response;
            });
        }

        return new Response("Not Found", { status: 404 });
    }
});

console.log(`Server running at http://localhost:${server.port}`);