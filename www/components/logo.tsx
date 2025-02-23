"use client";
import LogoImage from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

export const MainLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src={LogoImage} alt="PEST.js" width={100} height={100} className="w-6 h-6" />
      <h2 className="text-md font-bold font-code">PEST.js</h2>
    </Link>
  );
};
