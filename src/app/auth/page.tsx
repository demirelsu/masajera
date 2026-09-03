"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Giriş başarılı!");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "Kayıt başarılı! E-posta adresini kontrol et."
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F3EC] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <a
            href="/"
            className="text-3xl font-semibold text-[#19352A]"
          >
            Masajera
          </a>

          <h1 className="mt-8 text-2xl font-semibold text-[#19352A]">
            {isLogin ? "Tekrar hoş geldin" : "Masajera'ya katıl"}
          </h1>

          <p className="mt-2 text-sm text-[#707A74]">
            {isLogin
              ? "Hesabına giriş yap."
              : "Yeni hesabını birkaç adımda oluştur."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#19352A]">
              E-posta
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="w-full rounded-xl border border-[#E0D7CA] px-4 py-3 outline-none focus:border-[#19352A]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#19352A]">
              Şifre
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#E0D7CA] px-4 py-3 outline-none focus:border-[#19352A]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#19352A] py-3.5 font-medium text-white transition hover:bg-[#24473A]"
          >
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-xl bg-[#F7F3EC] p-4 text-center text-sm text-[#52645B]">
            {message}
          </p>
        )}

        <div className="mt-7 text-center text-sm text-[#707A74]">
          {isLogin
            ? "Henüz hesabın yok mu?"
            : "Zaten hesabın var mı?"}

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="ml-2 font-semibold text-[#19352A] underline underline-offset-4"
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </div>
      </div>
    </main>
  );
}