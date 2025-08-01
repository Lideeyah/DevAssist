import React, { useState } from "react";
import { X, Check, Star, Zap, Users, Building, CreditCard } from "lucide-react";
import { User } from "../App";

interface PricingModalProps {
   user: User | null;
   onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ user, onClose }) => {
   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
      "monthly"
   );
   // const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

   const plans = [
      {
         id: "free",
         name: "Free Forever",
         price: billingCycle === "monthly" ? "$0" : "$0",
         description: "Perfect for students and learning",
         features: [
            "Basic AI code suggestions",
            "Syntax highlighting",
            "Project templates",
            "Community support",
            "Africa-focused onboarding",
         ],
         icon: Star,
         popular: false,
         buttonText: "Get Started Free",
         buttonStyle:
            user?.subscription.plan === "free"
               ? "bg-gray-400 text-white cursor-not-allowed"
               : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]",
      },
      {
         id: "pro",
         name: "Pro Developer",
         price: billingCycle === "monthly" ? "$12" : "$120",
         originalPrice: billingCycle === "yearly" ? "$144" : null,
         description: "For serious developers building products",
         features: [
            "Advanced AI pair programming",
            "Real-time collaboration",
            "AI debugging assistant",
            "Code quality reviews",
            "Priority support",
            "Offline capabilities",
            "Local payment options (Paystack, M-Pesa)",
         ],
         icon: Zap,
         popular: true,
         buttonText: "Start Pro Trial",
         buttonStyle:
            user?.subscription.plan === "pro"
               ? "bg-gray-400 text-white cursor-not-allowed"
               : "bg-blue-600 hover:bg-blue-700 text-white",
      },
      {
         id: "team",
         name: "Team",
         price: billingCycle === "monthly" ? "$25" : "$250",
         originalPrice: billingCycle === "yearly" ? "$300" : null,
         description: "For growing African tech teams",
         features: [
            "Everything in Pro",
            "Team collaboration tools",
            "Admin dashboard",
            "Team analytics",
            "Custom AI training",
            "Priority African support",
            "Team billing (Flutterwave)",
         ],
         icon: Users,
         popular: false,
         buttonText: "Start Team Trial",
         buttonStyle:
            user?.subscription.plan === "business"
               ? "bg-gray-400 text-white cursor-not-allowed"
               : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
      },
      {
         id: "enterprise",
         name: "Enterprise",
         price: "Custom",
         description: "For large organizations across Africa",
         features: [
            "Everything in Team",
            "Custom deployment",
            "Advanced security",
            "SLA guarantee",
            "Dedicated support",
            "Custom integrations",
            "Enterprise billing solutions",
         ],
         icon: Building,
         popular: false,
         buttonText: "Contact Sales",
         buttonStyle:
            "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262C36]",
      },
   ];

   const paymentMethods = [
      {
         name: "Paystack",
         logo: "💳",
         countries:
            user?.country === "Nigeria" ||
            user?.country === "Ghana" ||
            user?.country === "South Africa"
               ? "Available"
               : "Not available in your region",
      },
      {
         name: "Flutterwave",
         logo: "🌊",
         countries:
            user?.country && user.country !== "Other (Outside Africa)"
               ? "Available"
               : "Available for African countries",
      },
      {
         name: "M-Pesa",
         logo: "📱",
         countries:
            user?.country === "Kenya" || user?.country === "Tanzania"
               ? "Available"
               : "Kenya, Tanzania only",
      },
      {
         name: "Stripe",
         logo: "💳",
         countries:
            user?.country === "Other (Outside Africa)"
               ? "Available"
               : "International payments",
      },
   ];

   const handlePlanSelect = (planId: string) => {
      if (user?.subscription.plan === planId) return;

      // Simulate payment process
      alert(
         `Redirecting to ${user?.currency} payment gateway for ${planId} plan...`
      );
      onClose();
   };

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div className="bg-white dark:bg-[#161B22] rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#30363D]">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                     Choose Your DevAssist Plan
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     {user
                        ? `Pricing in ${user.currency} for ${user.country}`
                        : "Built for African developers, priced for accessibility"}
                  </p>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center pt-6">
               <div className="bg-gray-100 dark:bg-[#262C36] p-1 rounded-lg">
                  <button
                     onClick={() => setBillingCycle("monthly")}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        billingCycle === "monthly"
                           ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-gray-100 shadow-sm"
                           : "text-gray-600 dark:text-gray-400"
                     }`}
                  >
                     Monthly
                  </button>
                  <button
                     onClick={() => setBillingCycle("yearly")}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                        billingCycle === "yearly"
                           ? "bg-white dark:bg-[#161B22] text-gray-900 dark:text-gray-100 shadow-sm"
                           : "text-gray-600 dark:text-gray-400"
                     }`}
                  >
                     Yearly
                     <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        Save 20%
                     </span>
                  </button>
               </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
               {plans.map((plan) => (
                  <div
                     key={plan.id}
                     className={`relative bg-white dark:bg-[#161B22] border rounded-xl p-6 transition-all ${
                        plan.popular
                           ? "border-blue-500 ring-2 ring-blue-500/20 scale-105"
                           : "border-gray-200 dark:border-[#30363D] hover:border-blue-500/50"
                     }`}
                  >
                     {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                           <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Most Popular
                           </span>
                        </div>
                     )}

                     <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                           <plan.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                           {plan.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                           {plan.description}
                        </p>
                        <div className="flex items-baseline justify-center">
                           <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              {plan.price}
                           </span>
                           {plan.price !== "Custom" && (
                              <span className="text-gray-600 dark:text-gray-400 ml-1">
                                 /{billingCycle === "monthly" ? "mo" : "yr"}
                              </span>
                           )}
                        </div>
                        {plan.originalPrice && (
                           <span className="text-gray-500 line-through text-sm">
                              {plan.originalPrice}/yr
                           </span>
                        )}
                     </div>

                     <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                           <li
                              key={index}
                              className="flex items-start space-x-3"
                           >
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                 {feature}
                              </span>
                           </li>
                        ))}
                     </ul>

                     <button
                        onClick={() => handlePlanSelect(plan.id)}
                        disabled={user?.subscription.plan === plan.id}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}
                     >
                        {user?.subscription.plan === plan.id
                           ? "Current Plan"
                           : plan.buttonText}
                     </button>
                  </div>
               ))}
            </div>

            {/* Payment Methods */}
            <div className="border-t border-gray-200 dark:border-[#30363D] p-6">
               <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Methods for {user?.country || "Your Region"}
               </h3>
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paymentMethods.map((method, index) => (
                     <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#262C36] rounded-lg"
                     >
                        <span className="text-2xl">{method.logo}</span>
                        <div>
                           <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {method.name}
                           </p>
                           <p className="text-xs text-gray-600 dark:text-gray-400">
                              {method.countries}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* CTA Footer */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
               <h3 className="text-white font-bold text-lg mb-2">
                  🌍 Built for Africa, Ready for the World
               </h3>
               <p className="text-white/90 text-sm">
                  Join thousands of African developers already building amazing
                  products with DevAssist
               </p>
            </div>
         </div>
      </div>
   );
};

export default PricingModal;
