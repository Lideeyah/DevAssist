const features = [
   {
      title: "AI-Powered Development Tools",
      description:
         "Smart AI that writes, fixes, and optimizes code - plus voice-to-code and multilingual support.",
   },
   {
      title: "Team Collaboration",
      description:
         "Real-time coding, debugging, and version control for seamless teamwork.",
   },
   {
      title: "SME Website Builder",
      description:
         "AI-driven no-code website creation with local payment integration.",
   },
   {
      title: "Developer Productivity & Management",
      description:
         "Dashboards, project tracking, and session management to boost efficiency.",
   },
];

export default function OurFeatures() {
   return (
      <section className="py-16 md:py-20 xl:py-32">
         <h2 className="text-3xl md:text-4xl font-semibold text-center tracking-tight">
            Our Features
         </h2>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 md:mt-16">
            {features.map((feature) => (
               <div className="bg-secondary/20 p-6 rounded-lg border" key={feature.title}>
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium mt-3">{feature.description}</p>
               </div>
            ))}
         </div>
      </section>
   );
}
