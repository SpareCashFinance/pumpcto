import { project } from "@/lib/config";

export function BrandMark({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.assets.mascot}
      alt=""
      width={size}
      height={size}
      className={`inline-block overflow-hidden rounded-full object-cover align-[-0.2em] ${className}`.trim()}
    />
  );
}
