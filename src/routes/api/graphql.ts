import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/graphql")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();

        const response = await fetch("http://localhost:8080/v1/graphql/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        return json(data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
      GET: async () => {
        const response = await fetch("http://localhost:8080/v1/graphql/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        return json(data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  },
});
