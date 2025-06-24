import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Only visible to authenticated users.</p>
      </div>
    </ProtectedRoute>
  );
}