// components/Loader.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loader() {
  return (
    <div className="p-4 border rounded space-y-4">
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full" />

      {/* Title placeholder */}
      <Skeleton className="h-6 w-3/4" />

      {/* Subtitle placeholder */}
      <Skeleton className="h-4 w-1/2" />

      {/* Avatar + text */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
