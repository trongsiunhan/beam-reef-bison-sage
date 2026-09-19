import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { BrowserSession } from "@/components/browser-session";
import { Button } from "@/components/ui/button";
import { useOrbitStore } from "@/lib/store";

export const Route = createFileRoute("/run/$id")({ component: RunProfile });

function RunProfile() {
  const { id } = Route.useParams();
  const profile = useOrbitStore((s) => s.profiles.find((p) => p.id === id) ?? null);
  const startProfile = useOrbitStore((s) => s.startProfile);
  const hydrated = useOrbitStore((s) => s.hydrated);

  useEffect(() => {
    if (profile && profile.status !== "running") startProfile(profile.id);
  }, [profile, startProfile]);

  if (!hydrated) {
    return <div className="flex-1 bg-surface" />;
  }

  if (!profile) {
    return (
      <div className="grid flex-1 place-items-center p-6 text-center">
        <div>
          <h1 className="text-lg font-semibold">Không tìm thấy hồ sơ</h1>
          <Button className="mt-4" asChild>
            <Link to="/">Về bảng hồ sơ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <BrowserSession profile={profile} />;
}
