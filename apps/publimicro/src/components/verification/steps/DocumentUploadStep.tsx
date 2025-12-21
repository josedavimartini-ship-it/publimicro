'use client';

import { useState, useRef } from 'react';

interface DocumentUploadStepProps {
  initialData: Partial<{
    document_type: 'cpf' | 'rg' | 'cnh' | 'passport';
    document_number: string;
    document_front?: File;
    document_back?: File;
    selfie?: File;
  }>;
  onSubmit: (data: { document_type: 'cpf' | 'rg' | 'cnh' | 'passport'; document_number: string; document_front?: File | null; document_back?: File | null; selfie?: File | null }) => void;
  onBack: () => void;
  loading: boolean;
}

export default function DocumentUploadStep({
  initialData,
  onSubmit,
  onBack,
  loading,
}: DocumentUploadStepProps) {
  type DocumentType = 'cpf' | 'rg' | 'cnh' | 'passport';

  const [formData, setFormData] = useState({
    document_type: initialData.document_type || 'rg' as DocumentType,
    document_number: initialData.document_number || '',
  });

  const [files, setFiles] = useState<{
    document_front: File | null;
    document_back: File | null;
    selfie: File | null;
  }>({
    document_front: null,
    document_back: null,
    selfie: null,
  });

  const [previews, setPreviews] = useState<{
    document_front: string | null;
    document_back: string | null;
    selfie: string | null;
  }>({
    document_front: null,
    document_back: null,
    selfie: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'document_front' | 'document_back' | 'selfie'
  ) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [type]: 'Arquivo muito grande (máx 5MB)' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, [type]: 'Apenas imagens são permitidas' });
        return;
      }

      setFiles({ ...files, [type]: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [type]: reader.result as string });
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors[type]) {
        setErrors({ ...errors, [type]: '' });
      }
    }
  };

  const removeFile = (type: 'document_front' | 'document_back' | 'selfie') => {
    setFiles({ ...files, [type]: null });
    setPreviews({ ...previews, [type]: null });
    
    // Reset file input
    if (type === 'document_front' && frontInputRef.current) {
      frontInputRef.current.value = '';
    } else if (type === 'document_back' && backInputRef.current) {
      backInputRef.current.value = '';
    } else if (type === 'selfie' && selfieInputRef.current) {
      selfieInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.document_number.trim()) {
      newErrors.document_number = 'Número do documento é obrigatório';
    }

    if (!files.document_front) {
      newErrors.document_front = 'Foto da frente do documento é obrigatória';
    }

    if (!files.selfie) {
      newErrors.selfie = 'Selfie com documento é obrigatória';
    }

    // Document back is optional for some types
    if (formData.document_type === 'rg' && !files.document_back) {
      newErrors.document_back = 'Foto do verso do RG é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        ...files,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-heading mb-2">
        Documentos de Identificação
      </h2>
      <p className="text-warm mb-6">
        Envie fotos nítidas do seu documento oficial com foto.
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-warm mb-2">
            Tipo de Documento *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'rg', label: 'RG' },
              { value: 'cnh', label: 'CNH' },
              { value: 'passport', label: 'Passaporte' },
              { value: 'cpf', label: 'CPF (com foto)' },
            ].map((doc) => (
              <button
                key={doc.value}
                type="button"
                onClick={() => setFormData({ ...formData, document_type: doc.value as DocumentType })}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  formData.document_type === doc.value
                    ? 'border-accent-gold bg-card text-warm'
                    : 'border'
                }`}
                style={formData.document_type === doc.value ? { borderColor: 'var(--text-accent)' } : { borderColor: 'var(--border-subtle)' }}
                disabled={loading}
              >
                {doc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document Number */}
        <div>
          <label htmlFor="document_number" className="block text-sm font-medium text-warm mb-2">
            Número do Documento *
          </label>
          <input
            type="text"
            id="document_number"
            value={formData.document_number}
            onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
              errors.document_number ? '' : ''
            }`}
            style={{ borderColor: errors.document_number ? 'var(--color-error)' : 'var(--border-subtle)' }}
            placeholder={formData.document_type === 'rg' ? '12.345.678-9' : ''}
            disabled={loading}
          />
          {errors.document_number && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>{errors.document_number}</p>
          )}
        </div>

        {/* Document Front */}
        <FileUploadField
          label="Foto da Frente do Documento"
          required
          preview={previews.document_front}
          error={errors.document_front}
          inputRef={frontInputRef}
          onChange={(e) => handleFileChange(e, 'document_front')}
          onRemove={() => removeFile('document_front')}
          loading={loading}
          helpText="Foto nítida, bem iluminada, sem reflexos"
        />

        {/* Document Back (conditional) */}
        {(formData.document_type === 'rg' || formData.document_type === 'cnh') && (
          <FileUploadField
            label="Foto do Verso do Documento"
            required={formData.document_type === 'rg'}
            preview={previews.document_back}
            error={errors.document_back}
            inputRef={backInputRef}
            onChange={(e) => handleFileChange(e, 'document_back')}
            onRemove={() => removeFile('document_back')}
            loading={loading}
          />
        )}

        {/* Selfie */}
        <FileUploadField
          label="Selfie Segurando o Documento"
          required
          preview={previews.selfie}
          error={errors.selfie}
          inputRef={selfieInputRef}
          onChange={(e) => handleFileChange(e, 'selfie')}
          onRemove={() => removeFile('selfie')}
          loading={loading}
          helpText="Tire uma selfie segurando o documento ao lado do rosto"
        />

        {/* Tips */}
        <div className="bg-card border rounded-lg p-4" style={{ borderColor: 'var(--color-warning)' }}>
          <h4 className="text-sm font-medium text-heading mb-2">
            📸 Dicas para fotos perfeitas:
          </h4>
          <ul className="text-sm text-warm space-y-1 list-disc list-inside">
            <li>Use um local bem iluminado (luz natural é melhor)</li>
            <li>Evite reflexos e sombras sobre o documento</li>
            <li>Certifique-se de que todos os dados estão legíveis</li>
            <li>Na selfie, seu rosto e o documento devem estar visíveis</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 btn-secondary disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar Documentos'}
          </button>
        </div>
      </form>
    </div>
  );
}

// File Upload Field Component
function FileUploadField({
  label,
  required,
  preview,
  error,
  inputRef,
  onChange,
  onRemove,
  loading,
  helpText,
}: {
  label: string;
  required?: boolean;
  preview: string | null;
  error?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  loading: boolean;
  helpText?: string;
}) {
  return (
    <div>
  <label className="block text-sm font-medium text-warm mb-2">
        {label} {required && '*'}
      </label>
      
      {!preview ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onChange}
            disabled={loading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              error ? '' : ''
            }`}
            style={{ borderColor: error ? 'var(--color-error)' : 'var(--border-subtle)' }}
          >
            <svg
              className="mx-auto h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              style={{ color: 'var(--border-subtle)' }}
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-warm">
              Clique para fazer upload ou tirar foto
            </p>
            {helpText && (
              <p className="mt-1 text-xs text-muted">{helpText}</p>
            )}
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
            style={{ border: '1px solid var(--border-subtle)' }}
          />
          <button
            type="button"
            onClick={onRemove}
            disabled={loading}
            className="absolute top-2 right-2 p-2 rounded-full focus:outline-none"
            style={{ background: 'var(--color-error)', color: 'var(--text-strong-dark)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
      )}
    </div>
  );
}







