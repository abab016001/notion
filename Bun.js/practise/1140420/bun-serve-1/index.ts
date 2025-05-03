import { serve } from 'bun';

const server = serve({
    port: 3000,
    fetch(req) {
        console.log("req.Method", req.method);
        const url = new URL(req.url);
        if (url.pathname === '/hello') {
            return Response.json({ message: "Hello Bun!" });
        }

        return new Response("Not Found QQ", { status: 404 });
    }
});

console.log(`Server running at http://localhost:${server.port}`);