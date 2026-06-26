import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { TUTORIALS, DOMAIN_COLORS } from "@/data/content";
import { PageHeader } from "./roadmaps";
import { DomainBadge } from "./index";

export const Route = createFileRoute("/tutorials/$slug")({
  loader: ({ params }) => {
    const tutorial = TUTORIALS.find((t) => t.slug === params.slug);
    if (!tutorial) throw notFound();
    return { tutorial };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.tutorial;
    if (!t) return {};
    return {
      meta: [
        { title: `${t.title} — Infynux Academy` },
        { name: "description", content: t.description },
        { property: "og:title", content: t.title },
        { property: "og:description", content: t.description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: TutorialPage,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Tutorial not found</h1>
      <Link to="/tutorials" className="mt-4 inline-block text-primary">Back to tutorials</Link>
    </div>
  ),
});

function TutorialPage() {
  const { tutorial } = Route.useLoaderData();
  const related = TUTORIALS.filter((t) => t.domain === tutorial.domain && t.slug !== tutorial.slug).slice(0, 3);
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Tutorials", to: "/tutorials" },
          { label: tutorial.title },
        ]}
        title={tutorial.title}
        subtitle={tutorial.description}
      />
      <article className="container-page max-w-3xl py-12">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <DomainBadge domain={tutorial.domain} />
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {tutorial.readMinutes} min read</span>
          <span>· {tutorial.difficulty}</span>
        </div>
        <div
          className="my-8 aspect-[16/9] rounded-2xl"
          style={{ background: `linear-gradient(135deg, color-mix(in oklch, ${DOMAIN_COLORS[tutorial.domain]} 65%, transparent), color-mix(in oklch, ${DOMAIN_COLORS[tutorial.domain]} 25%, transparent))` }}
          aria-hidden="true"
        />
        <div className="space-y-5 text-[15px] leading-relaxed text-foreground/90">
          {tutorial.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-10 flex flex-wrap gap-1.5">
          {tutorial.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>
          ))}
        </div>
      </article>

      <section className="container-page max-w-3xl">
        <div className="rounded-2xl gradient-hero px-6 py-8 text-center text-white shadow-xl">
          <h2 className="font-display text-xl font-bold">Ready for real experience?</h2>
          <p className="mt-1 text-sm text-white/85">Apply for an internship in this domain.</p>
          <Link
            to="/internships"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page py-16">
          <h2 className="font-display text-xl font-bold">Related tutorials</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/tutorials/$slug"
                params={{ slug: r.slug }}
                className="flex flex-col rounded-2xl border border-border bg-surface p-5 hover-lift"
              >
                <DomainBadge domain={r.domain} />
                <h3 className="mt-2 font-display text-base font-semibold line-clamp-2">{r.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{r.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="container-page max-w-3xl pb-16">
        <Link to="/tutorials" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to tutorials
        </Link>
      </div>
    </>
  );
}
