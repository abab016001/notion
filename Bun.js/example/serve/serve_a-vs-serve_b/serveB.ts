Bun.serve({
    port: 4000,
    async fetch(req) {
        const respFromA = await fetch("http://localhost:3000");
        const text = await respFromA.text();
        return new Response("Server B got response from A: " + text);
    }
});
console.log("Server B running on http://localhost:4000");