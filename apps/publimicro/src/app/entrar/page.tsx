"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, ArrowLeft } from "lucide-react";
import AchemeLogo from "@/components/AchemeLogo";

function EntrarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Get redirect URL from query params
  const redirectUrl = searchParams.get("redirect") || "/";

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(redirectUrl);
      }
    };
    checkUser();
  }, [supabase, router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    try {
      // 1. Run background check before registration
      const checkRes = await fetch("/api/background-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: email, // TODO: Replace with CPF if available in form
          full_name: fullName,
          birth_date: undefined, // TODO: Add birth_date field if required
          email,
        }),
      });
      const checkData = await checkRes.json();
      if (!checkRes.ok || checkData.finalStatus === 'rejected') {
        setError(checkData.rejectionReason || "Não foi possível criar a conta: restrição policial detectada.");
        setLoading(false);
        return;
      }
      if (checkData.finalStatus === 'needs_review') {
        setError("Sua inscrição requer análise manual. Entraremos em contato.");
        setLoading(false);
        return;
      }
      // 2. Proceed with registration if approved
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });
      if (error) throw error;
      setSuccess("Account created! Please check your email to verify your account.");
      // Profile is auto-created by database trigger (handle_new_user)
      console.log("User created successfully:", data.user?.id);
      // Switch to login mode after 3 seconds
      setTimeout(() => {
        setMode("login");
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-[#D4A574] hover:text-[#FFD700] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar para início</span>
        </Link>

        {/* Card */}
        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#3a3a3a] rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <AchemeLogo className="w-24 h-24" animate />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-[#B87333] via-[#D4A574] to-[#FFD700] bg-clip-text text-transparent">
            ACHEME
          </h1>
          <p className="text-center text-[#D4A574] text-sm mb-8 tracking-wider uppercase">
            Find For Me
          </p>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 bg-[#1a1a1a] p-1 rounded-xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-[#B87333] to-[#FFD700] text-[#0a0a0a]"
                  : "text-[#676767] hover:text-[#D4A574]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                mode === "signup"
                  ? "bg-gradient-to-r from-[#B87333] to-[#FFD700] text-[#0a0a0a]"
                  : "text-[#676767] hover:text-[#D4A574]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          {/* Forms */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[#D4A574] text-base font-bold mb-3">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#676767]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl text-[#e6c86b] placeholder-[#676767] focus:outline-none focus:border-[#B87333] transition"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#D4A574] text-base font-bold mb-3">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#676767]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-4 text-lg bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl text-[#e6c86b] placeholder-[#676767] focus:outline-none focus:border-[#B87333] transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#676767] hover:text-[#D4A574] transition"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-xl bg-gradient-to-r from-[#B87333] to-[#FFD700] hover:from-[#FFD700] hover:to-[#B87333] text-[#0a0a0a] font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-105"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[#D4A574] text-base font-bold mb-3">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#676767]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl text-[#e6c86b] placeholder-[#676767] focus:outline-none focus:border-[#B87333] transition"
                    placeholder="João Silva"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[#D4A574] text-base font-bold mb-3">
                  Telefone (opcional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#676767]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl text-[#e6c86b] placeholder-[#676767] focus:outline-none focus:border-[#B87333] transition"
                    placeholder="+55 11 98765-4321"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#D4A574] text-base font-bold mb-3">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#676767]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl text-[#e6c86b] placeholder-[#676767] focus:outline-none focus:border-[#B87333] transition"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#D4A574] text-base font-bold mb-3">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#676767]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-14 py-4 text-lg bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl text-[#e6c86b] placeholder-[#676767] focus:outline-none focus:border-[#B87333] transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#676767] hover:text-[#D4A574] transition"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[#D4A574] text-base font-bold mb-3">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#676767]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl text-[#e6c86b] placeholder-[#676767] focus:outline-none focus:border-[#B87333] transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-xl bg-gradient-to-r from-[#B87333] to-[#FFD700] hover:from-[#FFD700] hover:to-[#B87333] text-[#0a0a0a] font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-105"
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#3a3a3a]"></div>
            <span className="text-[#676767] text-sm">ou continue com</span>
            <div className="flex-1 h-px bg-[#3a3a3a]"></div>
          </div>

          {/* OAuth Providers */}
          <div className="space-y-3">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-gray-100 text-[#0a0a0a] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuar com Google</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[#676767] text-xs mt-6">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/termos" className="text-[#D4A574] hover:text-[#FFD700] transition">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-[#D4A574] hover:text-[#FFD700] transition">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-[#D4A574] text-xl">Carregando...</div>
      </div>
    }>
      <EntrarContent />
    </Suspense>
  );
}