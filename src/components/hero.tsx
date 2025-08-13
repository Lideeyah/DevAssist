import { Link } from "react-router";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
   return (
      <section className="relative flex flex-col items-center py-16 md:py-20 xl:py-24">
         <div className="relative flex flex-col items-center text-center max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl leading-[1.1]  font-bold tracking-tight">
               Code faster. Collaborate smarter. Build anywhere
            </h1>
            <p className="max-w-xl md:text-lg leading-[1.4] py-6 text-muted-foreground font-medium">
               AI-powered coding assistance that helps you build, debug,
               generate code, collaborate and do so much more. Less code time,
               better results, more efficiency: all on DevAssist!
            </p>
            <Button
               asChild
               size="lg"
               className="w-fit h-12 mt-4 has-[>svg]:px-6 text-lg group"
            >
               <Link to="/auth/sign-up">
                  Get Started{" "}
                  <ArrowUpRight className="size-5 group-hover:rotate-45 transition duration-300" />
               </Link>
            </Button>
         </div>

         <div className="w-full max-w-5xl aspect-[16/10] rounded-lg bg-secondary/20 backdrop-blur-md border mt-12 md:mt-20 z-20"></div>
      </section>
   );
}
