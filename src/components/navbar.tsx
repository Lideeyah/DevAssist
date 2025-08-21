import { Link } from "react-router";
import Logo from "./logo";
import { Button } from "./ui/button";
import UserDropdown from "./user-dropdow";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
   {
      label: "Pricing",
      href: "#pricing",
   },
   {
      label: "FAQs",
      href: "#faq",
   },
   {
      label: "Blog",
      href: "/blog",
   },
   {
      label: "Contact Support",
      href: "/contact-support",
   },
];

export default function Navbar() {
   const { user } = useAuth();

   return (
      <nav className="flex items-center justify-between h-20">
         <Logo />

         <ul className="hidden md:flex items-center gap-6 ">
            {navLinks.map((link) => (
               <li key={link.label} className="hover:text-primary transition">
                  <Link to={link.href}>{link.label}</Link>
               </li>
            ))}
         </ul>

         {!user ? (
            <div className="flex gap-4">
               <Button asChild variant="outline" size={"lg"}>
                  <Link to="/auth/sign-up">Sign Up</Link>
               </Button>
               <Button asChild size={"lg"}>
                  <Link to="/auth/sign-in">Sign In</Link>
               </Button>
            </div>
         ) : (
            <UserDropdown user={user} align="end" />
         )}
      </nav>
   );
}
