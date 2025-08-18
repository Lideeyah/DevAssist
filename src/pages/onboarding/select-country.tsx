import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { countries } from "@/lib/const";
import { CountryKey, OnboardOutletContext } from "@/types/onboarding";
import { useState } from "react";
import { useOutletContext } from "react-router";
import { toast } from "sonner";

export default function SelectCountry() {
   const { state, persist, navigate } =
      useOutletContext<OnboardOutletContext>();
   const [country, setCountry] = useState(state.country.selected ?? "");

   function onNext() {
      if (!country) {
         toast.warning("Please select a country.");
         return;
      }
      persist({
         country: { selected: country as CountryKey, completed: true },
      });
      navigate("/onboarding/path");
   }

   return (
      <main className="py-12 md:py-20 px-4">
         <div className="max-w-2xl mx-auto">
            <div className="flex items-start justify-between gap-4">
               <div className="space-y-2">
                  <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">
                     Select Your Country
                  </h1>
                  <p className="text-muted-foreground xl:text-lg max-w-md text-balance leading-[1.2]">
                     Currency automatically set based on country (NGN₦ for
                     Nigeria, GHS for Ghana)
                  </p>
               </div>
               <p className="text-xl">1 of 2</p>
            </div>

            <div className="space-y-8 mt-12">
               {/* <div className="relative">
                  <Input
                     className="peer ps-9 pe-9 h-12 md:text-base"
                     placeholder="Search your country"
                     type="search"
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                     <SearchIcon size={16} />
                  </div>
               </div> */}

               <RadioGroup
                  onValueChange={(value) => setCountry(value)}
                  defaultValue={country}
                  className="grid gap-4"
               >
                  {countries.map((c) => (
                     <Label
                        key={c.code}
                        htmlFor={c.code}
                        className="border-secondary/0 bg-secondary/20 has-data-[state=checked]:border-primary/50 relative rounded-md border-2 p-4 shadow-xs outline-none cursor-pointer"
                     >
                        <RadioGroupItem
                           id={c.code}
                           value={c.code}
                           className="sr-only order-1 after:absolute after:inset-0"
                        />
                        <div className="flex items-center justify-between w-full">
                           <div className="space-y-2">
                              <p className="text-lg leading-none font-medium">
                                 {c.name}
                              </p>
                              <p>
                                 {c.paymentGateway
                                    .join(", ")
                                    .split(" ")
                                    .map((gateway, i) => (
                                       <span
                                          key={i}
                                          className="text-muted-foreground font-normal"
                                       >
                                          {gateway}{" "}
                                       </span>
                                    ))}
                              </p>
                           </div>
                           <span>{c.code}</span>
                        </div>
                     </Label>
                  ))}
               </RadioGroup>
            </div>

            <div className="mt-16 flex justify-end gap-4">
               <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
               </Button>
               <Button variant="secondary" onClick={onNext}>
                  Next
               </Button>
            </div>
         </div>
      </main>
   );
}
