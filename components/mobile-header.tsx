
import { getCurrentUser } from "@/server/users";
import Image from "next/image";
import Link from "next/link";

export const MobileHeader = async () => {
  const { currentUser } = await getCurrentUser();

  return (
    <nav className="fixed top-0 z-50 flex h-[50px] w-full items-center justify-between border-b bg-blue-500 px-4 lg:hidden">
     
     {/* current page title */}
     <h1 className="text-lg font-bold text-white">AtriBOT</h1>
     
     {/* current user icon */}
     <div className="bg-white rounded-full p-2">
     <Link href="/profile">
     <Image src={
            (currentUser?.childGender === 'female' ? "/sidebar_icon/girl.png" : "/sidebar_icon/boy.png")
          } alt="User" height={24} width={24} />
    </Link>
    </div>
    </nav>
  );
};
