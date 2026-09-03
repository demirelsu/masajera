"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Expert = {
  id: string;
  display_name: string;
  title: string | null;
  city: string;
  district: string | null;
  bio: string | null;
  is_verified: boolean;
  avatar_url: string | null;
};

export default function Home() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);

  useEffect(() => {
    async function loadExperts() {
      const { data, error } = await supabase
        .from("expert_profiles")
        .select(
          "id, display_name, title, city, district, bio, is_verified, avatar_url"
        )
        .eq("is_published", true)
        .limit(6);

      if (!error && data) {
        setExperts(data);
      }

      setLoadingExperts(false);
    }

    loadExperts();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#19352A]">

      {/* NAVBAR */}
      <nav className="border-b border-[#E8DFD2] bg-[#F7F3EC]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-2xl font-semibold tracking-tight text-[#19352A]"
          >
            Masajera
          </a>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="#uzmanlar"
              className="text-[#52645B] hover:text-[#19352A]"
            >
              Uzmanları Keşfet
            </a>

            <a
              href="#nasil-calisir"
              className="text-[#52645B] hover:text-[#19352A]"
            >
              Nasıl Çalışır?
            </a>

            <a
              href="/expert"
              className="text-[#52645B] hover:text-[#19352A]"
            >
              Uzman Ol
            </a>

            <a
              href="/auth"
              className="rounded-full border border-[#CFC4B5] px-5 py-2.5 text-[#19352A] transition hover:bg-white"
            >
              Giriş Yap
            </a>
          </div>

          <a
            href="/auth"
            className="rounded-full border border-[#CFC4B5] px-4 py-2 text-sm md:hidden"
          >
            Menü
          </a>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">

          <div>

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#8B765D]">
              Premium Wellness Deneyimi
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight text-[#19352A] md:text-6xl">
              Kendine iyi
              <br />
              gelmenin yeni yolu.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-[#647169]">
              Sana uygun masaj uzmanlarını keşfet.
              Güvenilir profilleri incele, ihtiyaçlarına uygun
              hizmeti kolayca bul.
            </p>

            <div className="mt-9 rounded-2xl bg-white p-3 shadow-[0_15px_50px_rgba(40,50,45,0.08)]">

              <div className="flex flex-col gap-3 md:flex-row">

                <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#E6DED2] px-5 py-4">
                  <span className="text-xl">⌕</span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8B765D]">
                      Hizmet
                    </p>

                    <p className="mt-1 text-sm text-[#8A928D]">
                      Hangi hizmeti arıyorsun?
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#E6DED2] px-5 py-4">
                  <span className="text-xl">⌖</span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8B765D]">
                      Konum
                    </p>

                    <p className="mt-1 text-sm text-[#8A928D]">
                      Şehir seç
                    </p>
                  </div>
                </div>

                <a
                  href="#uzmanlar"
                  className="rounded-xl bg-[#19352A] px-8 py-4 text-center font-medium text-white transition hover:bg-[#24473A]"
                >
                  Uzmanları Bul
                </a>

              </div>
            </div>

          </div>

          {/* HERO VISUAL */}
          <div className="relative">

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#DCCFBE]">

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F7F3EC]/70 text-4xl">
                    ✦
                  </div>

                  <p className="text-sm uppercase tracking-[0.25em] text-[#52645B]">
                    Wellness
                  </p>

                  <p className="mt-2 text-3xl font-medium text-[#19352A]">
                    Your moment.
                  </p>

                </div>

              </div>

            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-6 py-5 shadow-xl">
              <p className="text-xs uppercase tracking-wider text-[#8B765D]">
                Masajera
              </p>

              <p className="mt-1 font-medium text-[#19352A]">
                İyi hisset. Yenilen.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="bg-white py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B765D]">
                Keşfet
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#19352A] md:text-4xl">
                Popüler wellness hizmetleri
              </h2>
            </div>

            <a
              href="#uzmanlar"
              className="text-sm font-medium text-[#19352A] underline underline-offset-4"
            >
              Tüm hizmetleri gör →
            </a>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: "✦",
                title: "Klasik Masaj",
                text: "Gevşemeye ve yenilenmeye zaman ayır.",
              },
              {
                icon: "◌",
                title: "Aromaterapi",
                text: "Kokuların ve dokunuşun sakinleştirici etkisi.",
              },
              {
                icon: "⌁",
                title: "Thai Masajı",
                text: "Geleneksel tekniklerle bedenini rahatlat.",
              },
              {
                icon: "○",
                title: "Spor Masajı",
                text: "Aktif yaşamını destekleyen profesyonel bakım.",
              },
            ].map((service) => (

              <div
                key={service.title}
                className="group rounded-2xl border border-[#E8DFD2] bg-[#F7F3EC] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DCE4DD] text-xl text-[#19352A]">
                  {service.icon}
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#19352A]">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#707A74]">
                  {service.text}
                </p>

                <p className="mt-6 text-sm font-medium text-[#19352A]">
                  Uzmanları keşfet →
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FEATURED EXPERTS */}
      <section
        id="uzmanlar"
        className="bg-[#F7F3EC] py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B765D]">
                Öne çıkan uzmanlar
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#19352A] md:text-4xl">
                Sana iyi gelecek uzmanı keşfet
              </h2>

              <p className="mt-3 max-w-xl text-[#707A74]">
                Farklı wellness alanlarında hizmet veren uzmanları
                incele ve sana uygun olanı bul.
              </p>

            </div>

            <a
              href="#uzmanlar"
              className="text-sm font-medium text-[#19352A] underline underline-offset-4"
            >
              Tüm uzmanları gör →
            </a>

          </div>

          {/* LOADING */}
          {loadingExperts ? (

            <div className="mt-10 rounded-3xl border border-[#E8DFD2] bg-white p-12 text-center">
              <p className="text-[#707A74]">
                Uzmanlar yükleniyor...
              </p>
            </div>

          ) : experts.length === 0 ? (

            /* EMPTY */
            <div className="mt-10 rounded-3xl border border-[#E8DFD2] bg-white p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F3EC] text-2xl">
                ✦
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#19352A]">
                Henüz yayınlanmış uzman yok
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#707A74]">
                İlk uzman profilini yayınladığında burada görünmeye başlayacak.
              </p>

              <a
                href="/expert"
                className="mt-6 inline-block rounded-full bg-[#19352A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#24473A]"
              >
                Uzman Profili Oluştur
              </a>

            </div>

          ) : (

            /* EXPERT CARDS */
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {experts.map((expert) => (

                <div
                  key={expert.id}
                  className="overflow-hidden rounded-3xl border border-[#E8DFD2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* FOTOĞRAF */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#DCCFBE]">

                    {expert.avatar_url ? (

                      <img
                        src={expert.avatar_url}
                        alt={expert.display_name}
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center">

                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F7F3EC] text-3xl text-[#19352A]">
                          {expert.display_name.charAt(0).toUpperCase()}
                        </div>

                      </div>

                    )}

                    {expert.is_verified && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#19352A]">
                        ✓ Doğrulanmış
                      </span>
                    )}

                  </div>

                  {/* BİLGİLER */}
                  <div className="p-6">

                    <h3 className="text-xl font-semibold text-[#19352A]">
                      {expert.display_name}
                    </h3>

                    <p className="mt-1 text-sm text-[#69746E]">
                      {expert.title || "Wellness Uzmanı"}
                    </p>

                    <p className="mt-4 text-sm text-[#8A928D]">
                      📍 {expert.city}
                      {expert.district
                        ? ` · ${expert.district}`
                        : ""}
                    </p>

                    {expert.bio && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#707A74]">
                        {expert.bio}
                      </p>
                    )}

                    <a
                      href={`/profile/${expert.id}`}
                      className="mt-6 block w-full rounded-xl border border-[#CFC4B5] py-3 text-center text-sm font-medium text-[#19352A] transition hover:bg-[#F7F3EC]"
                    >
                      Profili Gör
                    </a>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* WHY MASAJERA */}
      <section
        id="nasil-calisir"
        className="bg-[#19352A] py-24 text-white"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#DCCFBE]">
              Neden Masajera?
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              İyi hissetmek için
              <br />
              doğru uzmanı bul.
            </h2>

          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Güvenilir Profiller",
                text: "Uzmanların hizmetlerini ve profillerini inceleyerek bilinçli seçim yap.",
              },
              {
                number: "02",
                title: "Sana Uygun",
                text: "İhtiyacına, hizmetine ve konumuna göre sana uygun uzmanları keşfet.",
              },
              {
                number: "03",
                title: "Kolay Keşif",
                text: "Aradığın wellness deneyimine birkaç adımda ulaş.",
              },
            ].map((item) => (

              <div
                key={item.number}
                className="border-t border-white/20 pt-6"
              >

                <p className="text-sm text-[#DCCFBE]">
                  {item.number}
                </p>

                <h3 className="mt-5 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-white/60">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* EXPERT CTA */}
      <section className="bg-[#E9E0D4] py-20">

        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B765D]">
              Masaj uzmanları
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[#19352A]">
              Sen de Masajera'da yerini al.
            </h2>

            <p className="mt-3 max-w-xl text-[#647169]">
              Hizmetlerini sergile, profilini oluştur ve
              seni arayan müşterilerle buluş.
            </p>

          </div>

          <a
            href="/expert"
            className="rounded-full bg-[#19352A] px-7 py-4 font-medium text-white transition hover:bg-[#24473A]"
          >
            Uzman Profili Oluştur
          </a>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#F7F3EC]">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">

          <p className="text-lg font-semibold text-[#19352A]">
            Masajera
          </p>

          <p className="text-sm text-[#7B847F]">
            © 2026 Masajera. Tüm hakları saklıdır.
          </p>

        </div>

      </footer>

    </main>
  );
}