import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "node:path";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: join(import.meta.dirname, "../public"), // import.meta.dirname node.js >= v20.11.0
});

fastify.get("/", function (req, reply) {
  // index.html should never be cached
  reply.sendFile("index.html", { maxAge: 0, immutable: false });
});

// Declare a route
fastify.get("/api", async function handler(req, reply) {
  return { hello: "world" };
});

// Run the server!
try {
  await fastify.listen({ port: 8080 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
