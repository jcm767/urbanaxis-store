export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const id = searchParams?.session_id ?? '';
  return (
    <main style={{ padding: 24 }}>
      <h1>✅ Payment Success</h1>
      <p>Session: {id}</p>
      <p>Thanks for your order!</p>
    </main>
  );
}
