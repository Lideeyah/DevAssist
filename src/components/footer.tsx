import { Link } from "react-router";
import { SiLinkedin, SiInstagram, SiX } from "react-icons/si";
import Logo from "./logo";

export default function Footer() {
   return (
      <footer className="py-12 bg-secondary/20 border-t">
         <div className="w-[min(1000px,90%)] mx-auto">
            <Logo />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full mt-12">
               <ul className="flex flex-col gap-2 text-lg">
                  <li className="hover:text-primary transition">
                     <Link to="#">Features</Link>
                  </li>
                  <li className="hover:text-primary transition">
                     <Link to="#">Pricing</Link>
                  </li>
                  <li className="hover:text-primary transition">
                     <Link to="#">Blog</Link>
                  </li>
               </ul>
               <ul className="flex flex-col gap-2 text-lg">
                  <li className="hover:text-primary transition">
                     <Link to="#">Businesses/SMEs</Link>
                  </li>
                  <li className="hover:text-primary transition">
                     <Link to="#">Developers</Link>
                  </li>
                  <li className="hover:text-primary transition">
                     <Link to="#">Teams</Link>
                  </li>
               </ul>
               <ul className="flex flex-col gap-2 text-lg">
                  <li className="hover:text-primary transition">
                     <Link to="#">Contact Support</Link>
                  </li>
                  <li className="hover:text-primary transition">
                     <Link to="#">Community</Link>
                  </li>
                  <li className="hover:text-primary transition">
                     <Link to="#">Enterprise</Link>
                  </li>
               </ul>
               <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-semibold">Connect with us</h3>
                  <ul className="flex items-center gap-4">
                     <li className="hover:text-primary transition">
                        <Link to="#">
                           <SiLinkedin className="size-5"/>
                        </Link>
                     </li>
                      <li className="hover:text-primary transition">
                        <Link to="#">
                           <SiInstagram className="size-5"/>
                        </Link>
                     </li>
                      <li className="hover:text-primary transition">
                        <Link to="#">
                           <SiX className="size-5"/>
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </footer>
   );
}
