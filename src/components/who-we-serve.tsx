import { whoweserve } from "@/lib/const";
import { Icon } from "@iconify/react";

export default function WhoWeServe() {
   return (
      <section className="py-16 md:py-20 xl:py-32">
         <h2 className="text-3xl md:text-4xl font-semibold text-center tracking-tight">
            Who We Serve
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-16">
            {whoweserve.map((item) => (
               <div
                  key={item.title}
                  className="flex flex-col items-center py-12 px-6 bg-secondary/20 border rounded-lg"
               >
                  <div className="flex flex-col items-center gap-2">
                     {item.icon}
                     <h3 className="text-lg md:text-xl font-semibold text-center">
                        {item.title}
                     </h3>
                  </div>

                  <ul className="grid gap-4 text-muted-foreground mt-8 font-medium">
                     {item.features.map((feature) => (
                        <li className="flex items-start gap-2">
                           <Icon
                              icon="solar:check-circle-linear"
                              width="24"
                              height="24"
                              className="shrink-0 size-4 mt-1 text-emerald-400"
                           />
                           <span>{feature}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            ))}
         </div>
      </section>
   );
}
