import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "demirelminesu1@gmail.com";

export default async function AdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    redirect("/auth?error=admin_only");
  }

  const { data: experts, error } = await supabase
    .from("expert_profiles")
    .select("id, display_name, title, city, district, is_verified, is_published")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#19352A]">
      <header className="border-b border-[#E8DFD2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B765D]">
              Masajera Yönetim
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Admin Paneli</h1>
          </div>
          <span className="rounded-full bg-[#EAF0EB] px-4 py-2 text-sm font-medium">
            Admin
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#E8DFD2] bg-white p-6">
            <p className="text-sm text-[#707A74]">Toplam uzman</p>
            <p className="mt-2 text-3xl font-semibold">{experts?.length ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-[#E8DFD2] bg-white p-6">
            <p className="text-sm text-[#707A74]">Yayında</p>
            <p className="mt-2 text-3xl font-semibold">
              {experts?.filter((expert) => expert.is_published).length ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E8DFD2] bg-white p-6">
            <p className="text-sm text-[#707A74]">Doğrulanmış</p>
            <p className="mt-2 text-3xl font-semibold">
              {experts?.filter((expert) => expert.is_verified).length ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#E8DFD2] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8B765D]">
                Uzmanlar
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Uzman profilleri</h2>
            </div>
            <button
              type="button"
              className="rounded-xl bg-[#19352A] px-5 py-3 text-sm font-medium text-white hover:bg-[#24473A]"
            >
              + Yeni uzman
            </button>
          </div>

          {error ? (
            <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              Uzmanlar yüklenemedi. Veritabanı bağlantısını kontrol et.
            </p>
          ) : experts?.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-[#E8DFD2] text-[#707A74]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Uzman</th>
                    <th className="px-4 py-3 font-medium">Konum</th>
                    <th className="px-4 py-3 font-medium">Doğrulama</th>
                    <th className="px-4 py-3 font-medium">Durum</th>
                    <th className="px-4 py-3 font-medium">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {experts.map((expert) => (
                    <tr key={expert.id} className="border-b border-[#F0EAE1] last:border-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold">{expert.display_name}</p>
                        <p className="mt-1 text-xs text-[#707A74]">
                          {expert.title || "Wellness Uzmanı"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-[#707A74]">
                        {expert.city}{expert.district ? ` · ${expert.district}` : ""}
                      </td>
                      <td className="px-4 py-4">
                        {expert.is_verified ? "✓ Doğrulanmış" : "Bekliyor"}
                      </td>
                      <td className="px-4 py-4">
                        {expert.is_published ? "Yayında" : "Taslak"}
                      </td>
                      <td className="px-4 py-4">
                        <button type="button" className="font-medium underline underline-offset-4">
                          Düzenle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-[#F7F3EC] p-8 text-center text-[#707A74]">
              Henüz uzman profili yok.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
