'use client';

interface ProcessingStepProps {
  status: string;
}

export default function ProcessingStep({ status }: ProcessingStepProps) {
  const steps = [
    {
      key: 'cpf_check',
      label: 'Validando CPF',
      description: 'Verificando autenticidade do CPF na Receita Federal...',
    },
    {
      key: 'criminal_check',
      label: 'Checando Antecedentes',
      description: 'Consultando registros criminais e pendências...',
    },
    {
      key: 'completing',
      label: 'Finalizando',
      description: 'Processando resultado final...',
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verificando Seus Dados
        </h2>
        <p className="text-gray-600">
          Estamos processando suas informações. Isso pode levar alguns instantes.
        </p>
      </div>

      {/* Processing Steps */}
      <div className="max-w-2xl mx-auto space-y-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.key}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                isCurrent ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : isCurrent ? (
                  <svg
                    className="animate-spin w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <span className="text-white font-medium">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h3
                  className={`font-semibold ${
                    isCurrent ? 'text-blue-900' : 'text-gray-900'
                  }`}
                >
                  {step.label}
                </h3>
                {(isCompleted || isCurrent) && (
                  <p
                    className={`text-sm mt-1 ${
                      isCurrent ? 'text-blue-700' : 'text-gray-600'
                    }`}
                  >
                    {step.description}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {isCompleted && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Concluído
                  </span>
                )}
                {isCurrent && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Em andamento
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Aguardando
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-8 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              O que estamos verificando?
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Autenticidade do CPF na base da Receita Federal</li>
              <li>• Registros criminais e pendências judiciais</li>
              <li>• Conformidade com políticas de segurança da plataforma</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 max-w-2xl mx-auto">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% concluído
        </p>
      </div>

      {/* Loading Animation */}
      <div className="mt-8 flex justify-center gap-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
