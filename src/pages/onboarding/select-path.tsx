import { Button } from "@/components/ui/button";
import { whoweserve } from "@/lib/const";
import { cn } from "@/lib/utils";
import { OnboardOutletContext, PathKey } from "@/types/onboarding";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { toast } from "sonner";

export default function SelectPath() {
   const { state, persist, navigate } =
      useOutletContext<OnboardOutletContext>();
   const country = state.country.selected ?? "";
   const [path, setPath] = useState(state.path.selected ?? "");

   useEffect(() => {
      if (!country) {
         navigate("/onboarding/country", { replace: true });
      }
   }, [country, navigate]);

   // map titles (or items) to stable keys used in PathKey
   // adjust if your whoweserve data already contains an explicit `key`/`slug`
   const titleToKey = (title: string): PathKey => {
      const t = title.toLowerCase();
      if (t.includes("team")) return "team";
      if (t.includes("business") || t.includes("sme") || t.includes("owner"))
         return "business_owner";
      return "developer";
   };

   function choose(itemTitle: string) {
      setPath(itemTitle);
   }

   function onNext() {
      if (!path) {
         toast.warning("Please select a path.");
         return;
      }
      persist({
         path: { selected: path as PathKey, completed: true },
      });
      
      navigate("/dashboard");
   }

   function onBack() {
      navigate("/onboarding/country");
   }

   return (
      <main className="py-12 md:py-20 px-4">
         <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between gap-4">
               <div className="space-y-2">
                  <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">
                     Choose your path
                  </h1>
                  <p className="text-muted-foreground xl:text-lg max-w-md text-balance leading-[1.2]">
                     Select the option that best describes how you'll use
                     DevAssist
                  </p>
               </div>
               <p className="text-xl">2 of 2</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
               {whoweserve.map((item) => {
                  const isSelected = path === item.title;
                  return (
                     <div
                        key={item.title}
                        onClick={() => choose(item.title)}
                        aria-pressed={isSelected}
                        className={cn(
                           "flex flex-col items-center py-8 px-6 bg-secondary/20 border border-transparent hover:shadow-sm rounded-lg transition-shadow outline-none",
                           "focus:ring-2 focus:ring-offset-2 focus:ring-primary/40",
                           {
                              "bg-primary/10 border border-primary shadow-md":
                                 isSelected,
                           }
                        )}
                     >
                        <div className="flex flex-col items-center gap-1">
                           <div className="scale-75">{item.icon}</div>
                           <h3 className="text-lg md:text-xl font-semibold text-center">
                              {item.title}
                           </h3>
                        </div>

                        <div className="flex flex-col justify-between flex-1 w-full mt-6">
                           <ul className="grid gap-4 text-muted-foreground font-medium">
                              {item.features.map((feature) => (
                                 <li
                                    key={feature}
                                    className="flex items-start gap-2"
                                 >
                                    <Icon
                                       icon="solar:check-circle-linear"
                                       width="20"
                                       height="20"
                                       className="shrink-0 size-4 mt-1 text-emerald-400"
                                    />
                                    <span className="text-left">{feature}</span>
                                 </li>
                              ))}
                           </ul>

                           <div className="mt-6 w-full">
                              <Button
                                 size="lg"
                                 className={cn("w-full", {
                                    "cursor-default": isSelected,
                                 })}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    choose(item.title);
                                 }}
                                 aria-label={`Choose ${item.title}`}
                                 variant={isSelected ? "default" : "secondary"}
                              >
                                 {isSelected
                                    ? `Chosen: ${item.title}`
                                    : `Choose ${item.title}`}
                              </Button>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>

            <div className="mt-16 flex justify-center gap-4">
               <Button size="lg" variant="outline" onClick={onBack}>
                  Back
               </Button>
               <Button size="lg" variant="secondary" onClick={onNext}>
                  Submit
               </Button>
            </div>
         </div>
      </main>
   );
}
