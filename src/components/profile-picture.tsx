import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
   name?: string;
   image?: string;
}

export function UserAvatar({ name = "U", image }: UserAvatarProps) {
   const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
      
      const fallbackImage = `https://api.dicebear.com/9.x/dylan/svg?seed=${name}`;

   return (
      <Avatar className="size-9">
         <AvatarImage src={image ?? fallbackImage} alt={name} />
         <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
   );
}
