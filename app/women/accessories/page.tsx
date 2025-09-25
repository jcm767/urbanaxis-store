// app/page.tsx
import Link from "next/link";

export const metadata = { title: "Urban Axis (dev check)" };

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>👋 Urban Axis — dev check</h1>
      <p>If you can see this, rendering works.</p>
      <nav style={{ marginTop: 12 }}>
        <Link href="/men">Men</Link> {" | "}
        <Link href="/women">Women</Link>
      </nav>
    </main>
  );
}
