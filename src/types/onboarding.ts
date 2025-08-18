import { countries } from "@/lib/const";

export type CountryKey = (typeof countries)[number]["code"];
export type PathKey = "developer" | "team" | "business_owner";

export type OnboardState = {
   country: {
      selected?: CountryKey;
      completed?: boolean;
   };
   path: {
      selected?: PathKey;
      completed?: boolean;
   };
};

export type OnboardOutletContext = {
   state: OnboardState;
   persist: (patch: Partial<OnboardState>) => void;
   navigate: (to: string | number, options?: { replace?: boolean }) => void;
};
