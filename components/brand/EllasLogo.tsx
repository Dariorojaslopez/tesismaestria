import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  priority?: boolean;
};

export function EllasLogo({ className, priority }: Props) {
  return (
    <Image
      src="/brand/logo.ico"
      alt="Ellas — Cuidado capilar natural"
      width={128}
      height={128}
      className={cn("h-auto w-40 object-contain sm:w-48 md:w-52", className)}
      priority={priority}
    />
  );
}
