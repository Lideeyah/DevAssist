import React, { useState } from "react";
import { X, MapPin, Search, Globe } from "lucide-react";

interface CountrySelectionProps {
   onSelect: (country: string, currency: string) => void;
   onClose: () => void;
}

const CountrySelection: React.FC<CountrySelectionProps> = ({
   onSelect,
   onClose,
}) => {
   const [searchQuery, setSearchQuery] = useState("");

   const countries = [
      {
         name: "Nigeria",
         currency: "NGN",
         flag: "🇳🇬",
         gateway: "Paystack, Flutterwave",
      },
      {
         name: "Kenya",
         currency: "KES",
         flag: "🇰🇪",
         gateway: "M-Pesa, Flutterwave",
      },
      {
         name: "South Africa",
         currency: "ZAR",
         flag: "🇿🇦",
         gateway: "Paystack, Ozow",
      },
      {
         name: "Ghana",
         currency: "GHS",
         flag: "🇬🇭",
         gateway: "Flutterwave, Paystack",
      },
      { name: "Rwanda", currency: "RWF", flag: "🇷🇼", gateway: "Flutterwave" },
      {
         name: "Uganda",
         currency: "UGX",
         flag: "🇺🇬",
         gateway: "Flutterwave, MTN MoMo",
      },
      {
         name: "Tanzania",
         currency: "TZS",
         flag: "🇹🇿",
         gateway: "M-Pesa, Flutterwave",
      },
      { name: "Senegal", currency: "XOF", flag: "🇸🇳", gateway: "Flutterwave" },
      { name: "Cameroon", currency: "XAF", flag: "🇨🇲", gateway: "Flutterwave" },
      {
         name: "Egypt",
         currency: "EGP",
         flag: "🇪🇬",
         gateway: "Fawry, Flutterwave",
      },
      { name: "Morocco", currency: "MAD", flag: "🇲🇦", gateway: "Flutterwave" },
      { name: "Algeria", currency: "DZD", flag: "🇩🇿", gateway: "Flutterwave" },
      { name: "Tunisia", currency: "TND", flag: "🇹🇳", gateway: "Flutterwave" },
      { name: "Zambia", currency: "ZMW", flag: "🇿🇲", gateway: "Flutterwave" },
      { name: "Zimbabwe", currency: "ZWL", flag: "🇿🇼", gateway: "Flutterwave" },
      { name: "Ethiopia", currency: "ETB", flag: "🇪🇹", gateway: "Flutterwave" },
      { name: "Namibia", currency: "NAD", flag: "🇳🇦", gateway: "Flutterwave" },
      { name: "Botswana", currency: "BWP", flag: "🇧🇼", gateway: "Flutterwave" },
      {
         name: "Ivory Coast",
         currency: "XOF",
         flag: "🇨🇮",
         gateway: "Flutterwave",
      },
      { name: "Togo", currency: "XOF", flag: "🇹🇬", gateway: "Flutterwave" },
      { name: "Benin", currency: "XOF", flag: "🇧🇯", gateway: "Flutterwave" },
      { name: "Mali", currency: "XOF", flag: "🇲🇱", gateway: "Flutterwave" },
      {
         name: "Burkina Faso",
         currency: "XOF",
         flag: "🇧🇫",
         gateway: "Flutterwave",
      },
      { name: "Niger", currency: "XOF", flag: "🇳🇪", gateway: "Flutterwave" },
      {
         name: "Mauritania",
         currency: "MRU",
         flag: "🇲🇷",
         gateway: "Flutterwave",
      },
      {
         name: "Sierra Leone",
         currency: "SLL",
         flag: "🇸🇱",
         gateway: "Flutterwave",
      },
      { name: "Liberia", currency: "LRD", flag: "🇱🇷", gateway: "Flutterwave" },
      { name: "Gambia", currency: "GMD", flag: "🇬🇲", gateway: "Flutterwave" },
      { name: "Chad", currency: "XAF", flag: "🇹🇩", gateway: "Flutterwave" },
      { name: "Sudan", currency: "SDG", flag: "🇸🇩", gateway: "Flutterwave" },
      { name: "DR Congo", currency: "CDF", flag: "🇨🇩", gateway: "Flutterwave" },
      { name: "Angola", currency: "AOA", flag: "🇦🇴", gateway: "Flutterwave" },
      {
         name: "Mozambique",
         currency: "MZN",
         flag: "🇲🇿",
         gateway: "Flutterwave",
      },
      {
         name: "Other (Outside Africa)",
         currency: "USD",
         flag: "🌍",
         gateway: "Stripe, PayPal",
      },
   ];

   const filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
         <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#6C33FF] to-[#00A676] rounded-xl flex items-center justify-center">
                     <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Select Your Country
                     </h2>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">
                        This helps us set up local payment options and currency
                     </p>
                  </div>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
               <div className="relative">
                  <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search for your country..."
                     className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
               </div>
            </div>

            {/* Countries List */}
            <div className="max-h-96 overflow-y-auto">
               <div className="p-4 space-y-2">
                  {filteredCountries.map((country) => (
                     <button
                        key={country.name}
                        onClick={() => onSelect(country.name, country.currency)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#0D0D0D] rounded-xl transition-colors group"
                     >
                        <div className="flex items-center space-x-4">
                           <span className="text-2xl">{country.flag}</span>
                           <div className="text-left">
                              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-[#6C33FF]">
                                 {country.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                 {country.gateway}
                              </p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {country.currency}
                           </span>
                        </div>
                     </button>
                  ))}
               </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-[#0D0D0D] px-6 py-4 border-t border-gray-200 dark:border-gray-700">
               <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>
                     We support local payment methods for easier transactions
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CountrySelection;
