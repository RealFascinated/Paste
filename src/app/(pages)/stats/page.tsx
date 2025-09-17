import { StatsPageContent } from "@/components/stats/stats-page-content";

export default function StatsPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Site Statistics
            </h1>
            <p className="text-muted-foreground">
              Real-time insights into our paste sharing platform
            </p>
          </div>

          <StatsPageContent />
        </div>
      </div>
    </div>
  );
}
