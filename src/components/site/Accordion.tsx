import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionItem =
  | { q: string; a: string }
  | { question: string; answer: string };

function getQA(item: AccordionItem): { q: string; a: string } {
  if ("q" in item) return { q: item.q, a: item.a };
  return { q: item.question, a: item.answer };
}

export function Accordion({
  items,
}: {
  items: AccordionItem[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
      {items.map((item, i) => {
        const { q, a } = getQA(item);
        const open = openIdx === i;
        return (
          <div key={i}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
              onClick={() => setOpenIdx(open ? null : i)}
            >
              <span className="font-medium">{q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid overflow-hidden px-5 transition-all duration-300",
                open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <p className="text-sm text-muted-foreground">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

