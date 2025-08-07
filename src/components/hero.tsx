import { Link } from "react-router";
import { Button } from "./ui/button";

export default function Hero() {
   return (
      <section className=" flex flex-col items-center py-16 md:py-20 xl:py-24">
         <div className="relative flex flex-col items-center text-center max-w-xl ">
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl leading-[1.1] font-semibold">
               Transform the way you code with DevAssist
            </h1>
            <p className="max-w-md py-6 text-muted-foreground">
               Let AI automate your coding process, reducing errors and saving
               hours of manual work.
            </p>
            <Button asChild size="lg" className="w-fit">
               <Link to="/auth/sign-up">Get Started</Link>
            </Button>
         </div>

         <div className="w-full aspect-video rounded-lg bg-secondary/20 border mt-12 md:mt-20"></div>
      </section>
   );
}
