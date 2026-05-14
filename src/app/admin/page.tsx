export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-4 gap-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Total Users
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            12,540
          </h2>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Revenue
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            $45,220
          </h2>
        </div>
      </div>
    </div>
  );
}