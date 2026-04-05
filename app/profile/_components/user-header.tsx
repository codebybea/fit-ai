import Image from "next/image";

interface UserHeaderProps {
  name: string;
  image: string | null;
}

export function UserHeader({ name, image }: UserHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-[52px] shrink-0 overflow-hidden rounded-full">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="size-full bg-muted" />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="font-heading text-lg font-semibold leading-[1.05] text-foreground">
          {name}
        </p>
        <p className="font-heading text-sm leading-[1.15] text-foreground/70">
          Plano Básico
        </p>
      </div>
    </div>
  );
}
