import Image from "next/image";

import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    
    <div className="max-w-[1000px] mx-auto flex-1 w-full flex flex-col justify-center lg:flex-row items-center gap-4 relative">
         {/* left image */}
      <div className="relative w-full max-w-[400px] h-[300px] lg:h-[450px]">
        <Image
          src="/login_hero.png"
          fill
          alt="Children login image"
          className="object-contain"
          priority
        />
      </div>

         {/* right content */}
         <div className="flex flex-col items-center lg:items-start gap-6 z-10 ">
            <LoginForm />
        </div> 
    
    </div>
  );
}
