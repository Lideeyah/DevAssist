import DarkVeil from "@/components/dark-veil";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import OurFeatures from "@/components/our-features";
import Stats from "@/components/stats";
import Testimonials from "@/components/testimonials";
import WhoWeServe from "@/components/who-we-serve";

export default function LandingPage() {
   return (
      <>
         <div className="absolute inset-0 w-full max-h-screen">
            <DarkVeil 
               speed={1}
               scanlineFrequency={5}
               scanlineIntensity={0.36}
               warpAmount={2}
            />
         </div>
         <div className="relative w-[min(1050px,90%)] mx-auto">
            <Navbar />
            <main>
               <Hero />
               <Stats />
               <WhoWeServe />
               <OurFeatures />
               <Testimonials />
            </main>
         </div>
         <Footer />
      </>
   );
}
