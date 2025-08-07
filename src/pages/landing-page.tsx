import Hero from "@/components/hero";
import Navbar from "@/components/navbar";

export default function LandingPage() {
   return (
      <div className="relative w-[min(1200px,90%)] mx-auto">
         <Navbar />
         <main>
            <Hero />
         </main>
      </div>
   );
}
