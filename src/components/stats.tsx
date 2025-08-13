import CountUp from "./count-up";

export default function Stats() {
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-muted-foreground max-w-5xl w-full mx-auto">
         <div className="flex flex-col items-center gap-4 p-4">
            <p className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight">
               <CountUp
                  from={0}
                  to={300}
                  separator=","
                  direction="up"
                  duration={1}
               />
               <span>K</span>
            </p>
            <p className="text-lg md:text-xl font-medium">
               Developers onboarded
            </p>
         </div>
         <div className="flex flex-col items-center gap-4 p-4">
            <p className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight">
               <CountUp
                  from={0}
                  to={20}
                  separator=","
                  direction="up"
                  duration={1}
               />
               <span>K</span>
            </p>
            <p className="text-lg md:text-xl font-medium">Teams satisfied</p>
         </div>
         <div className="flex flex-col items-center gap-4 p-4">
            <p className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight">
               <CountUp
                  from={0}
                  to={85}
                  separator=","
                  direction="up"
                  duration={1}
               />
               <span>K</span>
            </p>
            <p className="text-lg md:text-xl font-medium">
               Businesses supported
            </p>
         </div>
      </div>
   );
}
