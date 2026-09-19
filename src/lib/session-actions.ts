import { closeSessionFn } from "@/lib/proxy-check.functions";
import { useOrbitStore } from "@/lib/store";

export async function stopOrbitProfile(id: string) {
  useOrbitStore.getState().stopProfile(id);
  try {
    await closeSessionFn({ data: { profileId: id } });
  } catch {
    /* session may already be gone */
  }
}

export async function stopAllOrbitProfiles() {
  const ids = useOrbitStore
    .getState()
    .profiles.filter((p) => p.status === "running")
    .map((p) => p.id);
  useOrbitStore.getState().stopAll();
  await Promise.all(
    ids.map((id) =>
      closeSessionFn({ data: { profileId: id } }).catch(() => undefined),
    ),
  );
}
