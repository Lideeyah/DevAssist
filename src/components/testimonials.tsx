import { Marquee } from "./marquee";

const reviews = [
   {
      name: "Elijah Bassey",
      role: "Developer @Microsoft",
      body: "I thoroughly enjoy using DevAssist. It feels like I’m coding in an environment that understands me.",
      img: "https://avatar.vercel.sh/jack",
   },
   {
      name: "Mercy Fola",
      role: "Team Lead @Supreme devs",
      body: "My team is thriving thanks you DevAssist. We are able to collaborate and ship efficiently.",
      img: "https://avatar.vercel.sh/jill",
   },
   {
      name: "John",
      role: "@john",
      body: "My team is thriving thanks you DevAssist. We are able to collaborate and ship efficiently.",
      img: "https://avatar.vercel.sh/john",
   },
   {
      name: "Jane",
      role: "@jane",
      body: "My team is thriving thanks you DevAssist. We are able to collaborate and ship efficiently.",
      img: "https://avatar.vercel.sh/jane",
   },
   {
      name: "Jenny",
      role: "@jenny",
      body: "My team is thriving thanks you DevAssist. We are able to collaborate and ship efficiently.",
      img: "https://avatar.vercel.sh/jenny",
   },
   {
      name: "James",
      role: "@james",
      body: "My team is thriving thanks you DevAssist. We are able to collaborate and ship efficiently.",
      img: "https://avatar.vercel.sh/james",
   },
];

export default function Testimonials() {
   return (
      <section className="py-16 md:py-20 xl:py-32">
         <h2 className="text-3xl md:text-4xl font-semibold text-center tracking-tight">
            Hear What Our Users Have to Say
         </h2>

         <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-12 md:mt-16">
            <Marquee pauseOnHover className="[--duration:20s]">
               {reviews.map((review) => (
                  <div className="w-80 bg-secondary/20 px-4 py-6 rounded-lg border">
                     <div className="flex flex-row items-center gap-2">
                        <img
                           className="rounded-full"
                           width="40"
                           height="40"
                           alt=""
                           src={review.img}
                        />
                        <div className="flex flex-col">
                           <p className="text-sm font-medium dark:text-white">
                              {review.name}
                           </p>
                           <p className="text-xs font-medium dark:text-white/40">
                              {review.role}
                           </p>
                        </div>
                     </div>
                     <blockquote className="mt-4">{review.body}</blockquote>
                  </div>
               ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
         </div>
      </section>
   );
}
