'use client';

import { useState } from 'react';

interface PersonalInfoStepProps {
  initialData: Partial<{
    full_name: string;
    cpf: string;
    date_of_birth: string;
    phone_number: string;
  }>;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function PersonalInfoStep({
  initialData,
  onSubmit,
  loading,
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || '',
    cpf: initialData.cpf || '',
    date_of_birth: initialData.date_of_birth || '',
    phone_number: initialData.phone_number || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'cpf') {
      value = formatCPF(value);
    } else if (name === 'phone_number') {
      value = formatPhone(value);
    }

    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome completo é obrigatório';
    }

    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    if (!cpfNumbers) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (cpfNumbers.length !== 11) {
      newErrors.cpf = 'CPF inválido (deve ter 11 dígitos)';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.date_of_birth = 'Você deve ter pelo menos 18 anos';
      }
    }

    if (formData.phone_number) {
      const phoneNumbers = formData.phone_number.replace(/\D/g, '');
      if (phoneNumbers.length < 10) {
        newErrors.phone_number = 'Telefone inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Informações Pessoais
      </h2>
      <p className="text-gray-600 mb-6">
        Para garantir a segurança da plataforma, precisamos verificar sua identidade.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="João da Silva"
            disabled={loading}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
            CPF *
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            maxLength={14}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.cpf ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="000.000.000-00"
            disabled={loading}
          />
          {errors.cpf && (
            <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Seu CPF será validado com a Receita Federal
          </p>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
            Data de Nascimento *
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.date_of_birth && (
            <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            Telefone (Opcional)
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            maxLength={15}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(11) 99999-9999"
            disabled={loading}
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-blue-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Suas informações estão seguras
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Seus dados pessoais são criptografados e usados apenas para verificação de identidade.
                Consulte nossa <a href="/privacy" className="underline">política de privacidade</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Salvando...' : 'Continuar'}
        </button>
      </form>
    </div>
  );
}
