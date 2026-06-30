import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatar?: string | null;
  className?: string;
  textClassName?: string;
}

const getAvatarPalette = (name: string) => {
  const seed = Array.from(name.trim() || "A").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = seed % 360;
  const secondaryHue = (hue + 35) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${hue} 75% 58%), hsl(${secondaryHue} 72% 48%))`,
  };
};

export default function UserAvatar({
  name,
  avatar,
  className,
  textClassName,
}: UserAvatarProps) {
  const displayName = name.trim() || "A";
  const fallbackLetter = displayName.charAt(0).toUpperCase();

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={`${displayName} avatar`}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn("rounded-full flex items-center justify-center text-white font-semibold", className)}
      style={getAvatarPalette(displayName)}
      aria-label={`${displayName} avatar`}
    >
      <span className={cn("leading-none", textClassName)}>{fallbackLetter}</span>
    </div>
  );
}
