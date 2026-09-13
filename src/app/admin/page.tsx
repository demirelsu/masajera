"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Expert = {
  id: string;
  display_name: string;
  title: string | null;
  city: string;
  district: string | null;
  is_verified: boolean;
  is_published: boolean;
};

type EditState = {
  id: string;
  display_name: string;
  title: string;
  city: string;
  district: string;
  is_verified: boolean;
  is_published: boolean;
};

export default function AdminPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [edit, setEdit] = useState<EditState | null>(null);

  async function loadExperts() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email?.toLowerCase() !== "demirelminesu1@gmail.com") {
      window.location.href = "/auth?error=admin_only";
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("expert_profiles")
      .select("id, display_name, title, city, district, is_verified, is_published")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setExperts(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadExperts();
  }, []);

  const filteredExperts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return experts;

    return experts.filter((expert) =>
      [expert.display_name, expert.title, expert.city, expert.district]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalized)
    );
  }, [experts, query]);

  function openEdit(expert: Expert) {
    setMessage("");
    setError("");
    setEdit({
      id: expert.id,
      display_name: expert.display_name,
      title: expert.title ?? "",
      city: expert.city,
      district: expert.district ?? "",
      is_verified: expert.is_verified,
      is_published: expert.is_published,
    });
  }

  async function saveEdit() {
    if (!edit) return;

    setSaving(true);
    setError("");
    setMessage("");

    const { error: saveError } = await supabase
      .from("expert_profiles")
      .update({
        display_name: edit.display_name.trim(),
        title: edit.title.trim() || null,
        city: edit.city.trim(),
        district: edit.district.trim() || null,
        is_verified: edit.is_verified,
        is_published: edit.is_published,
      })
      .eq("id", edit.id);

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setExperts((current) =>
      current.map((expert) =>
        expert.id === edit.id
          ? {
              ...expert,
              display_name: edit.display_name.trim(),
              title: edit.title.trim() || null,
              city: edit.city.trim(),
              district: edit.district.trim() || null,
              is_verified: edit.is_verified,
              is_published: edit.is_published,
            }
          : expert
      )
    );
    setEdit(null);
    setMessage("Uzman profili güncellendi.");
    setSaving(false);
  }

  async function deleteExpert(expert: Expert) {
    const confirmed = window.confirm(
      `${expert.display_name} profilini kalıcı olarak silmek istediğine emin misin?`
    );
    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("expert_profiles")
      .delete()
      .eq("id", expert.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setExperts((current) => current.filter((item) => item.id !== expert.id));
    setMessage("Uzman profili silindi.");
  }

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
          <a href="/" className="text-sm text-[#52645B] hover:text-[#19352A]">
            Siteye dön →
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          <Stat label="Toplam uzman" value={experts.length} />
          <Stat label="Yayında" value={experts.filter((expert) => expert.is_published).length} />
          <Stat label="Doğrulanmış" value={experts.filter((expert) => expert.is_verified).length} />
        </div>

        <div className="mt-8 rounded-3xl border border-[#E8DFD2] bg-white p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8B765D]">
                Moderasyon
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Uzman profilleri</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Uzman, şehir veya uzmanlık ara..."
                className="w-full rounded-xl border border-[#E0D7CA] px-4 py-3 text-sm outline-none focus:border-[#19352A] sm:w-72"
              />
              <a
                href="/expert"
                className="rounded-xl bg-[#19352A] px-5 py-3 text-center text-sm font-medium text-white hover:bg-[#24473A]"
              >
                + Yeni uzman başvurusu
              </a>
            </div>
          </div>

          {(error || message) && (
            <div className={`mt-6 rounded-xl p-4 text-sm ${error ? "bg-red-50 text-red-700" : "bg-[#EAF0EB] text-[#31533F]"}`}>
              {error || message}
            </div>
          )}

          {loading ? (
            <div className="mt-8 rounded-2xl bg-[#F7F3EC] p-10 text-center text-[#707A74]">
              Uzmanlar yükleniyor...
            </div>
          ) : filteredExperts.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
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
                  {filteredExperts.map((expert) => (
                    <tr key={expert.id} className="border-b border-[#F0EAE1] last:border-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold">{expert.display_name}</p>
                        <p className="mt-1 text-xs text-[#707A74]">{expert.title || "Wellness Uzmanı"}</p>
                      </td>
                      <td className="px-4 py-4 text-[#707A74]">
                        {expert.city}{expert.district ? ` · ${expert.district}` : ""}
                      </td>
                      <td className="px-4 py-4">
                        <Badge active={expert.is_verified} activeText="✓ Doğrulanmış" inactiveText="Bekliyor" />
                      </td>
                      <td className="px-4 py-4">
                        <Badge active={expert.is_published} activeText="Yayında" inactiveText="Taslak" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => openEdit(expert)} className="font-medium underline underline-offset-4">
                            Düzenle
                          </button>
                          <button type="button" onClick={() => deleteExpert(expert)} className="font-medium text-red-700 underline underline-offset-4">
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-[#F7F3EC] p-10 text-center text-[#707A74]">
              {query ? "Aramana uygun uzman bulunamadı." : "Henüz uzman profili yok."}
            </div>
          )}
        </div>
      </section>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8B765D]">Uzman düzenle</p>
                <h2 className="mt-2 text-2xl font-semibold">{edit.display_name || "Profil"}</h2>
              </div>
              <button type="button" onClick={() => setEdit(null)} className="rounded-full bg-[#F7F3EC] px-3 py-2 text-sm">Kapat</button>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <AdminField label="Ad soyad" value={edit.display_name} onChange={(value) => setEdit({ ...edit, display_name: value })} />
              <AdminField label="Uzmanlık / unvan" value={edit.title} onChange={(value) => setEdit({ ...edit, title: value })} />
              <AdminField label="Şehir" value={edit.city} onChange={(value) => setEdit({ ...edit, city: value })} />
              <AdminField label="İlçe" value={edit.district} onChange={(value) => setEdit({ ...edit, district: value })} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-[#E8DFD2] p-4">
                <input type="checkbox" checked={edit.is_verified} onChange={(event) => setEdit({ ...edit, is_verified: event.target.checked })} />
                <span className="text-sm font-medium">Uzmanı doğrula</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-[#E8DFD2] p-4">
                <input type="checkbox" checked={edit.is_published} onChange={(event) => setEdit({ ...edit, is_published: event.target.checked })} />
                <span className="text-sm font-medium">Profili yayına al</span>
              </label>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setEdit(null)} className="rounded-xl border border-[#CFC4B5] px-6 py-3 text-sm font-medium">Vazgeç</button>
              <button type="button" onClick={saveEdit} disabled={saving} className="rounded-xl bg-[#19352A] px-6 py-3 text-sm font-medium text-white disabled:opacity-50">
                {saving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#E8DFD2] bg-white p-6">
      <p className="text-sm text-[#707A74]">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Badge({ active, activeText, inactiveText }: { active: boolean; activeText: string; inactiveText: string }) {
  return <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${active ? "bg-[#EAF0EB] text-[#31533F]" : "bg-[#F3EEE7] text-[#7A6A58]"}`}>{active ? activeText : inactiveText}</span>;
}

function AdminField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#E0D7CA] px-4 py-3 outline-none focus:border-[#19352A]" />
    </label>
  );
}
