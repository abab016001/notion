import { serve } from 'bun';

const server = serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/hello") {
            return Response.json({ message: "Hello Bun!" });
        }

        return new Response("Not Found", { status: 404 });
    }
})

console.log(`Server running at http://localhost:${server.port}`);