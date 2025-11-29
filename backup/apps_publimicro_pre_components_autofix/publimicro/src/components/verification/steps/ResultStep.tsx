'use client';

import { useRouter } from 'next/navigation';

interface ResultStepProps {
  status: 'approved' | 'rejected' | 'manual_review';
  rejectionReason?: string;
  onRetry: () => void;
}

export default function ResultStep({ status, rejectionReason, onRetry }: ResultStepProps) {
  const router = useRouter();

  const statusConfig = {
    approved: {
      icon: (
        <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Verificação Aprovada! 🎉',
      description: 'Sua identidade foi verificada com sucesso. Agora você pode acessar todos os recursos premium da plataforma.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      buttonText: 'Continuar para Assinatura',
      buttonAction: () => router.push('/assinatura'),
    },
    manual_review: {
      icon: (
        <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Verificação em Análise Manual',
      description: 'Seus documentos estão sendo revisados pela nossa equipe. Você receberá uma notificação por e-mail em até 24 horas.',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      buttonText: 'Voltar ao Início',
      buttonAction: () => router.push('/'),
    },
    rejected: {
      icon: (
        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Verificação Não Aprovada',
      description: rejectionReason || 'Não foi possível aprovar sua verificação. Verifique se os documentos enviados estão corretos e tente novamente.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      buttonText: 'Tentar Novamente',
      buttonAction: onRetry,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="py-8">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        {config.icon}
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
        {config.title}
      </h2>

      {/* Description */}
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        {config.description}
      </p>

      {/* Status Card */}
      <div className={`max-w-2xl mx-auto ${config.bgColor} border ${config.borderColor} rounded-lg p-6 mb-8`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {status === 'approved' && (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'manual_review' && (
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {status === 'rejected' && (
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className={`font-semibold ${config.textColor} mb-2`}>
              {status === 'approved' && 'Próximos Passos'}
              {status === 'manual_review' && 'O que acontece agora?'}
              {status === 'rejected' && 'Motivo da Rejeição'}
            </h3>

            {status === 'approved' && (
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Você está verificado e pode acessar recursos premium</li>
                <li>✓ Escolha um plano de assinatura que se adeque às suas necessidades</li>
                <li>✓ Comece a destacar seus anúncios e alcançar mais clientes</li>
              </ul>
            )}

            {status === 'manual_review' && (
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Nossa equipe está revisando seus documentos manualmente</li>
                <li>• Você receberá um e-mail com o resultado em até 24 horas</li>
                <li>• Enquanto isso, você pode navegar pela plataforma normalmente</li>
              </ul>
            )}

            {status === 'rejected' && (
              <div className="text-sm text-red-800">
                <p className="mb-2">{rejectionReason}</p>
                <ul className="space-y-1">
                  <li>• Certifique-se de que as fotos estão nítidas e legíveis</li>
                  <li>• Verifique se o documento está dentro da validade</li>
                  <li>• Na selfie, seu rosto e o documento devem estar visíveis</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info for Manual Review */}
      {status === 'manual_review' && (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">
            Dúvidas frequentes:
          </h4>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-medium">Por que minha verificação precisa de revisão manual?</p>
              <p className="text-gray-600 mt-1">
                Alguns documentos precisam de verificação adicional para garantir a segurança de todos os usuários da plataforma.
              </p>
            </div>
            <div>
              <p className="font-medium">Quanto tempo demora?</p>
              <p className="text-gray-600 mt-1">
                Nossa equipe trabalha de segunda a sexta, das 9h às 18h. Você receberá uma resposta em até 24 horas úteis.
              </p>
            </div>
            <div>
              <p className="font-medium">Posso usar a plataforma enquanto aguardo?</p>
              <p className="text-gray-600 mt-1">
                Sim! Você pode navegar e interagir normalmente. Apenas recursos premium requerem verificação aprovada.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <button
          onClick={config.buttonAction}
          className={`flex-1 ${config.buttonColor} text-white py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
        >
          {config.buttonText}
        </button>

        {status !== 'approved' && (
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Voltar ao Início
          </button>
        )}
      </div>

      {/* Support Contact */}
      {status === 'rejected' && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Precisa de ajuda?{' '}
            <a href="/contato" className="text-blue-600 hover:text-blue-700 font-medium">
              Entre em contato com o suporte
            </a>
          </p>
        </div>
      )}

      {/* Email Notification Badge */}
      {status === 'manual_review' && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">
              Você receberá um e-mail quando a análise for concluída
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
