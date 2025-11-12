"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { X, Check, AlertCircle } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  userId: string;
}

interface FormData {
  full_name: string;
  cpf: string;
  phone: string;
  birth_date: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  terms_accepted: boolean;
}

const BRAZILIAN_STATES = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export function OnboardingModal({ isOpen, onComplete, userId }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    cpf: "",
    phone: "",
    birth_date: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    terms_accepted: false,
  });

  const supabase = createClientComponentClient();

  // Load existing profile data if any
  useEffect(() => {
    if (isOpen && userId) {
      loadProfileData();
    }
  }, [isOpen, userId]);

  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setFormData({
          full_name: data.full_name || "",
          cpf: data.cpf || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          cep: data.cep || "",
          street: data.street || "",
          number: data.number || "",
          complement: data.complement || "",
          neighborhood: data.neighborhood || "",
          city: data.city || "",
          state: data.state || "",
          terms_accepted: data.terms_accepted || false,
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  // Format CPF: 000.000.000-00
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  // Validate CPF
  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  // Format Phone: +55 (00) 00000-0000
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("55")) {
      const localNumber = numbers.substring(2);
      if (localNumber.length <= 11) {
        return `+55 ${localNumber
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d{1,4})$/, "$1-$2")}`;
      }
    } else if (numbers.length <= 11) {
      return `+55 ${numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2")}`;
    }
    return value;
  };

  // Format CEP: 00000-000
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
    }
    return value;
  };

  // Fetch address from CEP
  const fetchAddressFromCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching CEP:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let formattedValue = value;
    if (name === "cpf") formattedValue = formatCPF(value);
    if (name === "phone") formattedValue = formatPhone(value);
    if (name === "cep") {
      formattedValue = formatCEP(value);
      if (formattedValue.replace(/\D/g, "").length === 8) {
        fetchAddressFromCEP(formattedValue);
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : formattedValue,
    }));
  };

  const validateStep1 = () => {
    if (!formData.full_name.trim()) {
      setError("Nome completo é obrigatório");
      return false;
    }
    if (!validateCPF(formData.cpf)) {
      setError("CPF inválido");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Telefone é obrigatório");
      return false;
    }
    if (!formData.birth_date) {
      setError("Data de nascimento é obrigatória");
      return false;
    }
    
    // Check if user is at least 18 years old
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const isAdult = age > 18 || (age === 18 && monthDiff >= 0);
    
    if (!isAdult) {
      setError("Você deve ter pelo menos 18 anos para se cadastrar");
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.cep.trim()) {
      setError("CEP é obrigatório");
      return false;
    }
    if (!formData.street.trim()) {
      setError("Endereço é obrigatório");
      return false;
    }
    if (!formData.number.trim()) {
      setError("Número é obrigatório");
      return false;
    }
    if (!formData.neighborhood.trim()) {
      setError("Bairro é obrigatório");
      return false;
    }
    if (!formData.city.trim()) {
      setError("Cidade é obrigatória");
      return false;
    }
    if (!formData.state) {
      setError("Estado é obrigatório");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.terms_accepted) {
      setError("Você deve aceitar os termos para continuar");
      return;
    }
    
    setLoading(true);

    try {
      // Update user profile
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          full_name: formData.full_name,
          cpf: formData.cpf.replace(/\D/g, ""),
          phone: formData.phone,
          birth_date: formData.birth_date,
          cep: formData.cep.replace(/\D/g, ""),
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          terms_accepted: formData.terms_accepted,
          terms_accepted_at: new Date().toISOString(),
          profile_completed: true,
          can_schedule_visits: true,
          can_place_bids: false, // Only granted after verification
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Success - close modal and refresh
      onComplete();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#2a2a1a]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#E6C98B] mb-1">
                Complete seu Cadastro
              </h2>
              <p className="text-sm text-[#8B9B6E]">
                Para agendar visitas e fazer lances, precisamos de algumas informações
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#676767] font-medium">
                Passo {step} de 3
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-[#A8C97F]' : 'bg-[#2a2a2a]'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-[#A8C97F]' : 'bg-[#2a2a2a]'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-[#A8C97F]' : 'bg-[#2a2a2a]'}`} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#A8C97F] mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#A8C97F] text-[#0a0a0a] flex items-center justify-center font-bold">
                    1
                  </div>
                  Informações Pessoais
                </h3>

                <div>
                  <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                    CPF * (necessário para verificação)
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                  <p className="text-xs text-[#676767] mt-1">
                    Seu CPF será usado apenas para verificação de identidade e segurança
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    placeholder="+55 (00) 00000-0000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    required
                  />
                  <p className="text-xs text-[#676767] mt-1">
                    Você deve ter pelo menos 18 anos
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#A8C97F] mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#A8C97F] text-[#0a0a0a] flex items-center justify-center font-bold">
                    2
                  </div>
                  Endereço
                </h3>

                <div>
                  <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />
                  <p className="text-xs text-[#676767] mt-1">
                    Digite seu CEP para preencher automaticamente o endereço
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                      Rua/Avenida *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                      placeholder="Nome da rua"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complement"
                    value={formData.complement}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    placeholder="Apto, Bloco, etc (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                    placeholder="Nome do bairro"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] placeholder-[#676767] focus:outline-none focus:border-[#A8C97F] transition-colors"
                      placeholder="Nome da cidade"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#E6C98B] mb-2">
                      Estado *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg text-[#E6C98B] focus:outline-none focus:border-[#A8C97F] transition-colors"
                      required
                    >
                      <option value="">Selecione...</option>
                      {BRAZILIAN_STATES.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Terms and Conditions */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#A8C97F] mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#A8C97F] text-[#0a0a0a] flex items-center justify-center font-bold">
                    3
                  </div>
                  Termos e Autorização
                </h3>

                <div className="bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg p-6 max-h-64 overflow-y-auto">
                  <h4 className="text-sm font-bold text-[#E6C98B] mb-3">
                    Autorização para Verificação e Uso de Dados
                  </h4>
                  <div className="text-xs text-[#8B9B6E] space-y-2">
                    <p>
                      Ao aceitar estes termos, você autoriza a PubliMicro a:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Verificar seus dados pessoais através de registros policiais e órgãos públicos</li>
                      <li>Processar e armazenar suas informações de forma segura e criptografada</li>
                      <li>Utilizar seu CPF exclusivamente para fins de identificação e segurança</li>
                      <li>Entrar em contato através do telefone/email fornecido</li>
                      <li>Compartilhar informações básicas com anunciantes em caso de agendamento de visitas</li>
                    </ul>
                    <p className="mt-4">
                      <strong>Permissões concedidas:</strong>
                    </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>✓ Agendar visitas a propriedades</li>
                      <li>✓ Fazer lances em leilões e ofertas</li>
                      <li>✓ Conversar com anunciantes via Chat</li>
                    </ul>
                    <p className="mt-4">
                      <strong>Proteção de dados:</strong> Seus dados são protegidos pela LGPD (Lei Geral de Proteção de Dados) 
                      e nunca serão compartilhados com terceiros sem sua autorização expressa, exceto quando exigido por lei.
                    </p>
                    <p className="mt-4">
                      <strong>Verificação policial:</strong> A verificação de antecedentes é realizada para garantir a 
                      segurança de todos os usuários da plataforma, especialmente em visitas presenciais a propriedades.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#2a2a2a] border border-[#3a3a2a] rounded-lg p-4">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded border-[#3a3a2a] text-[#A8C97F] focus:ring-[#A8C97F] focus:ring-offset-0 bg-[#1a1a1a]"
                    required
                  />
                  <label className="text-sm text-[#E6C98B]">
                    Li e aceito os termos de uso e autorizo a PubliMicro a verificar meus dados pessoais conforme 
                    descrito acima. Estou ciente de que essas informações são necessárias para agendar visitas e 
                    participar de leilões/lances na plataforma.
                  </label>
                </div>

                <div className="bg-[#0D7377]/20 border border-[#0D7377] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#A8C97F] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[#E6C98B]">
                      <p className="font-bold mb-1">Após completar o cadastro, você poderá:</p>
                      <ul className="text-xs text-[#8B9B6E] space-y-1">
                        <li>• Agendar visitas a propriedades disponíveis</li>
                        <li>• Participar de leilões e fazer lances</li>
                        <li>• Conversar com anunciantes através do Chat</li>
                        <li>• Salvar favoritos e receber notificações</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 bg-[#2a2a2a] text-[#E6C98B] rounded-lg hover:bg-[#3a3a2a] transition-all font-medium"
                >
                  Voltar
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] text-white rounded-lg transition-all font-bold"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !formData.terms_accepted}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] text-white rounded-lg transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Salvando..." : "Completar Cadastro"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
