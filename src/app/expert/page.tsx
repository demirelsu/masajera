"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type FormState = {
  display_name: string;
  title: string;
  city: string;
  district: string;
  bio: string;
  phone: string;
  avatar_url: string;
};

const initialForm: FormState = {
  display_name: "",
  title: "",
  city: "",
  district: "",
  bio: "",
  phone: "",
  avatar_url: "",
};

export default function ExpertPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth?error=login_required");
        return;
      }

      setUserId(user.id);

      const { data: existing, error: existingError } = await supabase
        .from("expert_profiles")
        .select("display_name, title, city, district, bio, phone, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (existingError) {
        setError(existingError.message);
      } else if (existing) {
        setForm({
          display_name: existing.display_name ?? "",
          title: existing.title ?? "",
          city: existing.city ?? "",
          district: existing.district ?? "",
          bio: existing.bio ?? "",
          phone: existing.phone ?? "",
          avatar_url: existing.avatar_url ?? "",
        });
      }

      setLoading(false);
    }

    loadUser();
  }, [router]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      id: userId,
      display_name: form.display_name.trim(),
      title: form.title.trim() || null,
      city: form.city.trim(),
      district: form.district.trim() || null,
      bio: form.bio.trim() || null,
      phone: form.phone.trim() || null,
      avatar_url: form.avatar_url.trim() || null,
      is_published: false,
      is_verified: false,
    };

    const { error: saveError } = await supabase
      .from("expert_profiles")
      .upsert(payload, { onConflict: "id" });

    if (saveError) {
      setError(
        "Profil kaydedilemedi. Hesabının uzman profili oluşturma yetkisini ve Supabase RLS politikalarını kontrol et. " +
          saveError.message
      );
      setSaving(false);
      return;
    }

    setMessage("Profilin kaydedildi. Admin onayından sonra yayına alınabilir.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC]">
        <p className="text-[#19352A]">Profil alanı yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#19352A]">
      <nav className="border-b border-[#E8DFD2] bg-[#F7F3EC]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-semibold tracking-tight">
            Masajera
          </a>
          <a
            href="/"
            className="text-sm text-[#52645B] hover:text-[#19352A]"
          >
            ← Ana sayfa
          </a>
        </div>
      </nav>

      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B765D]">
              Uzman başvurusu
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Uzman profilini oluştur
            </h1>
            <p className="mt-5 leading-7 text-[#69746E]">
              Bilgilerini ekle. Profilin taslak olarak kaydedilir ve yayınlanmadan
              önce admin tarafından kontrol edilir.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[2rem] border border-[#E8DFD2] bg-white p-6 shadow-sm md:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Ad soyad"
                required
                value={form.display_name}
                onChange={(value) => updateField("display_name", value)}
                placeholder="Ayşe Yılmaz"
              />
              <Field
                label="Uzmanlık / unvan"
                value={form.title}
                onChange={(value) => updateField("title", value)}
                placeholder="Masaj Terapisti"
              />
              <Field
                label="Şehir"
                required
                value={form.city}
                onChange={(value) => updateField("city", value)}
                placeholder="İstanbul"
              />
              <Field
                label="İlçe"
                value={form.district}
                onChange={(value) => updateField("district", value)}
                placeholder="Kadıköy"
              />
              <Field
                label="Telefon"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="05xx xxx xx xx"
                type="tel"
              />
              <Field
                label="Profil fotoğrafı URL"
                value={form.avatar_url}
                onChange={(value) => updateField("avatar_url", value)}
                placeholder="https://..."
                type="url"
              />
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-[#19352A]">
                Hakkında
              </label>
              <textarea
                required
                minLength={20}
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Deneyimin, uzmanlık alanların ve müşterilere sunduğun yaklaşım..."
                rows={6}
                className="w-full resize-y rounded-xl border border-[#E0D7CA] px-4 py-3 outline-none transition focus:border-[#19352A]"
              />
            </div>

            {(error || message) && (
              <div
                className={`mt-6 rounded-xl p-4 text-sm ${
                  error
                    ? "bg-red-50 text-red-700"
                    : "bg-[#EAF0EB] text-[#31533F]"
                }`}
              >
                {error || message}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <a
                href="/"
                className="rounded-xl border border-[#CFC4B5] px-6 py-3 text-center text-sm font-medium text-[#19352A] hover:bg-[#F7F3EC]"
              >
                Vazgeç
              </a>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#19352A] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#24473A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Kaydediliyor..." : "Profili Kaydet"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#19352A]">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E0D7CA] px-4 py-3 outline-none transition focus:border-[#19352A]"
      />
    </div>
  );
}
