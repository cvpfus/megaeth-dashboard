import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

interface AllocationResponse {
  clearing_price: string
  token_allocation: string
  usdt_allocation: string
}

export const Route = createFileRoute("/api/megaeth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const entityId = url.searchParams.get('entityId');

        if (!entityId) {
          return json({ error: 'Entity ID is required' }, {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        try {
          const response = await fetch(`https://token-api.megaeth.com/api/allocation?entityId=${entityId}`);

          if (!response.ok) {
            return json({ error: `Failed to fetch allocation: ${response.statusText}` }, {
              status: response.status,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const data: AllocationResponse = await response.json();

          return json(data, {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('API proxy error:', error);
          return json({ error: 'Internal server error' }, {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
  }
});
