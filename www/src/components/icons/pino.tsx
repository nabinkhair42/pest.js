import Image from "next/image";

export const Pino = ({ className = "size-5" }: { className?: string }) => (
  <Image
    alt="Pino Logo"
    src="/icons/pino.png"
    width={64}
    height={64}
    className={className}
  />
);