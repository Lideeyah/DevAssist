import { Icon } from "@iconify/react";

export const countries = [
   {
      code: "NGN",
      name: "Nigeria",
      paymentGateway: ["Paystack", "Flutterwave"],
   },
   { code: "GHC", name: "Ghana", paymentGateway: ["Paystack", "Flutterwave"] },
   { code: "KES", name: "Kenya", paymentGateway: ["Flutterwave"] },
   { code: "ZAR", name: "South Africa", paymentGateway: ["Paystack"] },
   { code: "USD", name: "Other", paymentGateway: ["Stripe"] },
] as const;

export const whoweserve = [
   {
      icon: (
         <div className="size-20 grid place-items-center bg-primary/20 rounded-full">
            <Icon
               icon="solar:code-linear"
               width="24"
               height="24"
               className="text-primary size-10"
            />
         </div>
      ),
      title: "Developers",
      features: [
         "Real-time code suggestions (GPT/Claude/DeepSeek)",
         "Bug Fix Assistant with auto debug",
         "Voice-to-text coding support",
         "Auto-generate README and documentation",
         "Session management and auto backup",
      ],
   },
   {
      icon: (
         <div className="size-20 grid place-items-center bg-primary/20 rounded-full">
            <Icon
               icon="solar:users-group-two-rounded-linear"
               width="24"
               height="24"
               className="text-primary size-10"
            />
         </div>
      ),
      title: "Teams",
      features: [
         "Everything in Developer",
         "Collaborative coding (Code Live Share)",
         "Team chat and comment sidebar",
         "AI insights on team performance",
         "Shared folders and repositories",
      ],
   },
   {
      icon: (
         <div className="size-20 grid place-items-center bg-primary/20 rounded-full">
            <Icon
               icon="solar:shop-2-linear"
               width="24"
               height="24"
               className="text-primary size-10"
            />
         </div>
      ),
      title: "Businesses/SMEs",
      features: [
         '"Describe Your Business" AI Wizard',
         "Auto-generate websites and logos",
         "E-commerce and booking integration",
         "Domain management integration",
      ],
   },
];
