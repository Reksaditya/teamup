import TeamUp from "./teamup";
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<p>Memuat TeamUp…</p>}>
      <TeamUp />
    </Suspense>
  );
}
