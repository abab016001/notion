
Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response("Hello from Server A on port 3000");
    }
});

console.log("Server A running on http://localhost:3000");