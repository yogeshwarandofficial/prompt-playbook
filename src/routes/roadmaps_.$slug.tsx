import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/roadmaps_/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/learn/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
});
