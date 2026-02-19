export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">
        Saubh Admin — {locale}
      </h1>
      <p className="mb-6 text-gray-500">Dashboard placeholder</p>

      <div className="flex gap-4">
        <a
          href={`/${locale}/users`}
          className="rounded-lg border border-gray-200 px-6 py-4 hover:bg-gray-50"
        >
          <div className="font-medium">Users</div>
          <div className="text-sm text-gray-400">Manage platform users</div>
        </a>
        <a
          href={`/${locale}/businesses`}
          className="rounded-lg border border-gray-200 px-6 py-4 hover:bg-gray-50"
        >
          <div className="font-medium">Businesses</div>
          <div className="text-sm text-gray-400">Manage registered businesses</div>
        </a>
      </div>
    </div>
  );
}
