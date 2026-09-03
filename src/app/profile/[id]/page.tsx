"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Expert = {
  id: string;
  display_name: string;
  title: string | null;
  city: string;
  district: string | null;
  bio: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_verified: boolean;
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price: number | null;
};

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [expert, setExpert] = useState<Expert | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;

      const { data: expertData, error: expertError } = await supabase
        .from("expert_profiles")
        .select(
          "id, display_name, title, city, district, bio, phone, avatar_url, is_verified"
        )
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();

      if (expertError) {
        setErrorMessage(expertError.message);
        setLoading(false);
        return;
      }

      if (!expertData) {
        setErrorMessage("Bu uzman profili bulunamadı.");
        setLoading(false);
        return;
      }

      setExpert(expertData);

      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select(
          "id, name, description, duration_minutes, price"
        )
        .eq("expert_id", id)
        .order("created_at", { ascending: false });

      if (serviceError) {
        setErrorMessage(serviceError.message);
      } else {
        setServices(serviceData || []);
      }

      setLoading(false);
    }

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC]">
        <p className="text-[#19352A]">
          Profil yükleniyor...
        </p>
      </main>
    );
  }

  if (errorMessage || !expert) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[#19352A]">
            Profil bulunamadı
          </h1>

          <p className="mt-3 text-[#707A74]">
            {errorMessage || "Bu uzman profili artık yayınlanmıyor."}
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-full bg-[#19352A] px-6 py-3 text-sm font-medium text-white"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#19352A]">

      {/* NAVBAR */}
      <nav className="border-b border-[#E8DFD2] bg-[#F7F3EC]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-2xl font-semibold tracking-tight"
          >
            Masajera
          </a>

          <a
            href="/"
            className="text-sm text-[#52645B] hover:text-[#19352A]"
          >
            ← Uzmanlara Dön
          </a>

        </div>
      </nav>

      {/* PROFILE */}
      <section className="px-6 py-12 md:py-20">

        <div className="mx-auto max-w-5xl">

          <div className="overflow-hidden rounded-[2rem] border border-[#E8DFD2] bg-white shadow-sm">

            {/* PROFILE HEADER */}

            <div className="bg-[#DCCFBE] px-6 py-14 md:px-12">

              <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">

                {/* PROFILE PHOTO */}

              {expert.avatar_url ? (
  <div className="h-64 w-64 overflow-hidden rounded-3xl border-8 border-[#F7F3EC] bg-white shadow-lg">
    <img
      src={expert.avatar_url}
      alt={expert.display_name}
      className="h-full w-full object-cover"
    />
  </div>
) : (
  <div className="flex h-64 w-64 items-center justify-center rounded-3xl border-8 border-[#F7F3EC] bg-white text-7xl font-semibold text-[#19352A] shadow-lg">
    {expert.display_name.charAt(0).toUpperCase()}
  </div>
)}

                <div>

                  {expert.is_verified && (
                    <span className="inline-block rounded-full bg-white px-4 py-2 text-xs font-medium text-[#19352A]">
                      ✓ Doğrulanmış Uzman
                    </span>
                  )}

                  <h1 className="mt-3 text-4xl font-semibold text-[#19352A] md:text-5xl">
                    {expert.display_name}
                  </h1>

                  <p className="mt-2 text-lg text-[#52645B]">
                    {expert.title || "Wellness Uzmanı"}
                  </p>

                  <p className="mt-3 text-sm text-[#647169]">
                    📍 {expert.city}
                    {expert.district
                      ? ` · ${expert.district}`
                      : ""}
                  </p>

                </div>

              </div>

            </div>

            {/* CONTENT */}

            <div className="grid gap-10 p-6 md:grid-cols-[1fr_320px] md:p-10">

              <div>

                {/* ABOUT */}

                <h2 className="text-2xl font-semibold">
                  Hakkında
                </h2>

                <p className="mt-5 whitespace-pre-line leading-8 text-[#69746E]">
                  {expert.bio ||
                    "Bu uzman henüz hakkında bilgisi eklememiş."}
                </p>

                {/* SERVICES */}

                <div className="mt-12">

                  <h2 className="text-2xl font-semibold">
                    Hizmetler
                  </h2>

                  {services.length === 0 ? (

                    <div className="mt-5 rounded-2xl border border-[#E8DFD2] bg-[#F7F3EC] p-6">
                      <p className="text-sm text-[#707A74]">
                        Bu uzman henüz hizmet eklememiş.
                      </p>
                    </div>

                  ) : (

                    <div className="mt-5 space-y-4">

                      {services.map((service) => (

                        <div
                          key={service.id}
                          className="rounded-2xl border border-[#E8DFD2] bg-[#F7F3EC] p-6"
                        >

                          <div className="flex flex-col justify-between gap-4 sm:flex-row">

                            <div>

                              <h3 className="text-lg font-semibold text-[#19352A]">
                                {service.name}
                              </h3>

                              {service.description && (
                                <p className="mt-2 text-sm leading-6 text-[#707A74]">
                                  {service.description}
                                </p>
                              )}

                              <div className="mt-4 flex flex-wrap gap-3">

                                {service.duration_minutes && (
                                  <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#69746E]">
                                    ⏱ {service.duration_minutes} dk
                                  </span>
                                )}

                                {service.price !== null && (
                                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#19352A]">
                                    ₺{service.price}
                                  </span>
                                )}

                              </div>

                            </div>

                            <button
                              type="button"
                              className="h-fit rounded-xl bg-[#19352A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#24473A]"
                            >
                              Bilgi Al
                            </button>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              </div>

              {/* CONTACT CARD */}

              <div>

                <div className="sticky top-6 rounded-3xl border border-[#E8DFD2] bg-[#F7F3EC] p-6">

                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#8B765D]">
                    İletişim
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">
                    Bu uzmanla iletişime geç
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#707A74]">
                    Hizmet hakkında bilgi almak için uzmanla
                    iletişime geçebilirsin.
                  </p>

                  {expert.phone ? (
                    <a
                      href={`tel:${expert.phone}`}
                      className="mt-6 block w-full rounded-xl bg-[#19352A] py-4 text-center font-medium text-white transition hover:bg-[#24473A]"
                    >
                      İletişime Geç
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-6 w-full rounded-xl bg-[#19352A] py-4 font-medium text-white opacity-50"
                    >
                      İletişim bilgisi mevcut değil
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-[#E8DFD2] bg-[#F7F3EC]">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <p className="text-lg font-semibold">
            Masajera
          </p>

          <p className="mt-2 text-sm text-[#7B847F]">
            © 2026 Masajera. Tüm hakları saklıdır.
          </p>

        </div>

      </footer>

    </main>
  );
}