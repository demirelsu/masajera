"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price: number | null;
};

export default function ExpertPage() {
  const [userId, setUserId] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isPublished, setIsPublished] = useState(false);

  const [services, setServices] = useState<Service[]>([]);

  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [servicePrice, setServicePrice] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [addingService, setAddingService] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Önce giriş yapmalısın.");
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("expert_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setMessage(error.message);
      } else if (data) {
        setDisplayName(data.display_name || "");
        setTitle(data.title || "");
        setCity(data.city || "");
        setDistrict(data.district || "");
        setBio(data.bio || "");
        setPhone(data.phone || "");
        setAvatarUrl(data.avatar_url || "");
        setIsPublished(data.is_published || false);
      }

      await loadServices(user.id);

      setLoading(false);
    }

    loadUser();
  }, []);

  async function loadServices(expertId: string) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("expert_id", expertId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setServices(data);
    }
  }

  async function handleAvatarUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file || !userId) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Lütfen bir görsel dosyası seç.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Fotoğraf en fazla 5 MB olabilir.");
      return;
    }

    setUploadingAvatar(true);
    setMessage("");

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      setMessage(`Fotoğraf yüklenemedi: ${uploadError.message}`);
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("expert_profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      setMessage(`Fotoğraf kaydedilemedi: ${updateError.message}`);
    } else {
      setAvatarUrl(publicUrl);
      setMessage("Profil fotoğrafın başarıyla güncellendi! 📸");
    }

    setUploadingAvatar(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      setMessage("Önce giriş yapmalısın.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("expert_profiles").upsert(
      {
        id: userId,
        display_name: displayName,
        title,
        city,
        district,
        bio,
        phone,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profilin başarıyla kaydedildi! 🌿");
    }

    setSaving(false);
  }

  async function handlePublish() {
    if (!userId) {
      setMessage("Önce giriş yapmalısın.");
      return;
    }

    if (!displayName || !city) {
      setMessage(
        "Yayınlamadan önce isim ve şehir bilgilerini doldurmalısın."
      );
      return;
    }

    setPublishing(true);
    setMessage("");

    const { error } = await supabase
      .from("expert_profiles")
      .update({
        is_published: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      setMessage(error.message);
    } else {
      setIsPublished(true);
      setMessage("Profilin yayına alındı! 🎉");
    }

    setPublishing(false);
  }

  async function handleUnpublish() {
    if (!userId) return;

    setPublishing(true);
    setMessage("");

    const { error } = await supabase
      .from("expert_profiles")
      .update({
        is_published: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      setMessage(error.message);
    } else {
      setIsPublished(false);
      setMessage("Profilin yayından kaldırıldı.");
    }

    setPublishing(false);
  }

  async function handleAddService(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      setMessage("Önce giriş yapmalısın.");
      return;
    }

    if (!serviceName) {
      setMessage("Hizmet adı gerekli.");
      return;
    }

    setAddingService(true);
    setMessage("");

    const { error } = await supabase.from("services").insert({
      expert_id: userId,
      name: serviceName,
      description: serviceDescription || null,
      duration_minutes: serviceDuration
        ? Number(serviceDuration)
        : null,
      price: servicePrice ? Number(servicePrice) : null,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setServiceName("");
      setServiceDescription("");
      setServiceDuration("");
      setServicePrice("");

      await loadServices(userId);

      setMessage("Hizmet başarıyla eklendi! ✨");
    }

    setAddingService(false);
  }

  async function handleDeleteService(serviceId: string) {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setServices((current) =>
      current.filter((service) => service.id !== serviceId)
    );

    setMessage("Hizmet silindi.");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC]">
        <p className="text-[#19352A]">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] px-6 py-12">
      <div className="mx-auto max-w-3xl">

        <div className="mb-10 text-center">
          <a
            href="/"
            className="text-3xl font-semibold tracking-tight text-[#19352A]"
          >
            Masajera
          </a>

          <h1 className="mt-8 text-3xl font-semibold text-[#19352A]">
            Uzman Paneli
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-[#707A74]">
            Profilini ve sunduğun hizmetleri buradan yönetebilirsin.
          </p>
        </div>

        {/* PROFILE FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#E5DED3] bg-white p-6 shadow-sm sm:p-10"
        >
          <h2 className="text-2xl font-semibold text-[#19352A]">
            Profil Bilgileri
          </h2>

          {/* PROFILE PHOTO */}

          <div className="mt-8 flex flex-col items-center">

            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#DCCFBE]">

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || "Profil fotoğrafı"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-semibold text-[#19352A]">
                  {displayName
                    ? displayName.charAt(0).toUpperCase()
                    : "M"}
                </span>
              )}

            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="mt-4 rounded-full border border-[#CFC4B5] px-5 py-2.5 text-sm font-medium text-[#19352A] transition hover:bg-[#F7F3EC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingAvatar
                ? "Fotoğraf yükleniyor..."
                : avatarUrl
                  ? "Fotoğrafı Değiştir"
                  : "Profil Fotoğrafı Ekle"}
            </button>

            <p className="mt-2 text-xs text-[#8A928D]">
              JPG, PNG veya WEBP · Maksimum 5 MB
            </p>

          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Görünen isim
              </label>

              <input
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Uzmanlık başlığı
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn. Wellness & Masaj Uzmanı"
                className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Şehir
              </label>

              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                İlçe
              </label>

              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Telefon
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Hakkında
              </label>

              <textarea
                rows={6}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full resize-none rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 w-full rounded-xl bg-[#19352A] py-4 font-medium text-white transition hover:bg-[#24473A] disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : "Profilimi Kaydet"}
          </button>

          {!isPublished ? (
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="mt-3 w-full rounded-xl border border-[#19352A] bg-[#F7F3EC] py-4 font-medium text-[#19352A] transition hover:bg-[#EDE6DA]"
            >
              {publishing ? "Yayınlanıyor..." : "Profili Yayınla"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUnpublish}
              disabled={publishing}
              className="mt-3 w-full rounded-xl border border-[#C9BDAE] bg-white py-4 font-medium text-[#52645B]"
            >
              {publishing
                ? "İşleniyor..."
                : "Profili Yayından Kaldır"}
            </button>
          )}
        </form>

        {/* SERVICES */}

        <section className="mt-8 rounded-3xl border border-[#E5DED3] bg-white p-6 shadow-sm sm:p-10">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B765D]">
              Hizmetlerim
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#19352A]">
              Sunduğun hizmetleri ekle
            </h2>

            <p className="mt-2 text-sm text-[#707A74]">
              Müşteriler profilinde eklediğin hizmetleri görecek.
            </p>
          </div>

          <form
            onSubmit={handleAddService}
            className="mt-8 space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-medium">
                Hizmet adı
              </label>

              <input
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Örn. Klasik Masaj"
                className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Açıklama
              </label>

              <textarea
                rows={4}
                value={serviceDescription}
                onChange={(e) =>
                  setServiceDescription(e.target.value)
                }
                placeholder="Hizmet hakkında kısa bilgi..."
                className="w-full resize-none rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Süre (dakika)
                </label>

                <input
                  type="number"
                  min="1"
                  value={serviceDuration}
                  onChange={(e) =>
                    setServiceDuration(e.target.value)
                  }
                  placeholder="60"
                  className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Fiyat (₺)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={servicePrice}
                  onChange={(e) =>
                    setServicePrice(e.target.value)
                  }
                  placeholder="1500"
                  className="w-full rounded-xl border border-[#DED6CA] px-4 py-3 outline-none focus:border-[#19352A]"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={addingService}
              className="w-full rounded-xl bg-[#19352A] py-4 font-medium text-white transition hover:bg-[#24473A] disabled:opacity-60"
            >
              {addingService
                ? "Ekleniyor..."
                : "Hizmet Ekle"}
            </button>

          </form>

          {services.length > 0 && (
            <div className="mt-10 border-t border-[#E8DFD2] pt-8">

              <h3 className="font-semibold text-[#19352A]">
                Eklediğin hizmetler
              </h3>

              <div className="mt-5 space-y-4">

                {services.map((service) => (

                  <div
                    key={service.id}
                    className="rounded-2xl border border-[#E8DFD2] bg-[#F7F3EC] p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h4 className="font-semibold text-[#19352A]">
                          {service.name}
                        </h4>

                        {service.description && (
                          <p className="mt-2 text-sm leading-6 text-[#707A74]">
                            {service.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#8A928D]">

                          {service.duration_minutes && (
                            <span>
                              ⏱ {service.duration_minutes} dk
                            </span>
                          )}

                          {service.price !== null && (
                            <span>
                              ₺{service.price}
                            </span>
                          )}

                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteService(service.id)
                        }
                        className="text-sm text-[#8B765D] hover:text-red-700"
                      >
                        Sil
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}

        </section>

        {message && (
          <div className="mt-6 rounded-xl bg-[#F3EEE5] p-4 text-center text-sm text-[#52645B]">
            {message}
          </div>
        )}

      </div>
    </main>
  );
}