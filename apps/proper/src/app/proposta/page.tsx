"use client";

import { useState, useEffect, Suspense } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  DollarSign, FileText, Check, AlertCircle, TrendingUp,
  Home, Calendar, User
} from "lucide-react";

function ProposalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const propertyId = searchParams.get('propertyId');
  
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [visitCompleted, setVisitCompleted] = useState(false);

  // Form fields
  const [bidAmount, setBidAmount] = useState('');
  const [useFinancing, setUseFinancing] = useState(false);
  const [downPayment, setDownPayment] = useState('');
  const [message, setMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (propertyId) {
      checkAuthorization();
    } else {
      setError('Property ID is required');
      setChecking(false);
    }
  }, [propertyId]);

  const checkAuthorization = async () => {
    setChecking(true);
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/entrar?redirect=/proposta?propertyId=${propertyId}`);
        return;
      }
      setUser(user);

      // Fetch property details
      const { data: propertyData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propError) throw propError;
      setProperty(propertyData);

      // Check if user has completed a visit
      const { data: visitData, error: visitError } = await supabase
        .from('visits')
        .select('*')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .in('status', ['confirmed', 'completed'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (visitError) throw visitError;

      if (!visitData || visitData.length === 0) {
        // No visit found - redirect to schedule visit
        router.push(`/property/${propertyData.slug}#schedule-visit`);
        return;
      }

      setVisitCompleted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to verify authorization');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create bid/proposal
      const { data, error: bidError } = await supabase
        .from('bids')
        .insert({
          property_id: propertyId,
          user_id: user.id,
          amount: parseFloat(bidAmount),
          use_financing: useFinancing,
          down_payment: downPayment ? parseFloat(downPayment) : null,
          message: message,
          status: 'pending',
        })
        .select()
        .single();

      if (bidError) throw bidError;

      // Play auction sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/lances`); // Redirect to user's bids page
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#B87333] border-t-transparent mb-4"></div>
          <p className="text-[#d8c68e]">Verifying authorization...</p>
        </div>
      </main>
    );
  }

  if (error && !property) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-red-500/30 rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-[#d8c68e] mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#2a2a1a] hover:bg-[#3a3a2a] text-[#d8c68e] rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#B87333] via-[#DAA520] to-[#FFD700] bg-clip-text text-transparent mb-3">
            Fazer Proposta
          </h1>
          {property && (
            <div className="flex items-center gap-3 text-[#d8c68e]">
              <Home className="w-5 h-5" />
              <span className="text-lg">{property.title}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-500 font-semibold mb-1">Proposal Submitted Successfully! 🎉</p>
              <p className="text-sm text-green-400">
                The property owner will review your proposal. Redirecting to your bids page...
              </p>
            </div>
          </div>
        )}

        {/* Property Info */}
        {property && (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-[#B87333] mb-4">Property Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#676767]">Price:</span>
                <span className="ml-2 text-[#FFD700] font-bold text-xl">
                  ${property.price.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#676767]">Location:</span>
                <span className="ml-2 text-[#d8c68e]">
                  {property.city}, {property.state}
                </span>
              </div>
              <div>
                <span className="text-[#676767]">Type:</span>
                <span className="ml-2 text-[#d8c68e] capitalize">
                  {property.property_type}
                </span>
              </div>
              <div>
                <span className="text-[#676767]">Transaction:</span>
                <span className="ml-2 text-[#d8c68e] capitalize">
                  {property.transaction_type}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-[#B87333] mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Your Offer
            </h3>

            {/* Bid Amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                Proposal Amount (USD) *
              </label>
              <input
                required
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                step="1000"
                min="0"
                placeholder="Enter your offer"
                className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] text-2xl font-bold placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
              />
              {property && bidAmount && (
                <p className="mt-2 text-sm text-[#676767]">
                  {parseFloat(bidAmount) < property.price ? (
                    <span className="text-yellow-500">
                      ⚠️ Your offer is {((1 - parseFloat(bidAmount) / property.price) * 100).toFixed(1)}% below asking price
                    </span>
                  ) : parseFloat(bidAmount) > property.price ? (
                    <span className="text-green-500">
                      ✓ Your offer is {((parseFloat(bidAmount) / property.price - 1) * 100).toFixed(1)}% above asking price
                    </span>
                  ) : (
                    <span className="text-[#B87333]">✓ Offering asking price</span>
                  )}
                </p>
              )}
            </div>

            {/* Financing Option */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useFinancing}
                  onChange={(e) => setUseFinancing(e.target.checked)}
                  className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333]"
                />
                <span className="text-[#d8c68e] font-semibold">
                  I plan to use financing
                </span>
              </label>

              {useFinancing && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Down Payment (USD)
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    step="1000"
                    min="0"
                    placeholder="Enter down payment amount"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                  />
                  {downPayment && bidAmount && (
                    <p className="mt-2 text-sm text-[#676767]">
                      Down payment: {((parseFloat(downPayment) / parseFloat(bidAmount)) * 100).toFixed(1)}% of offer
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Message to Seller */}
            <div>
              <label className="block text-sm font-semibold text-[#d8c68e] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Message to Property Owner (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Introduce yourself, explain your interest, timeline, etc..."
                className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                required
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 rounded border-[#2a2a1a] bg-[#0a0a0a] text-[#B87333] focus:ring-[#B87333] mt-1"
              />
              <div className="text-sm text-[#d8c68e]">
                I understand that this is a binding offer. By submitting this proposal, I agree to proceed with the purchase 
                if the property owner accepts my offer. I have completed the property visit and verified all information. *
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-gradient-to-r from-[#B87333] to-[#DAA520] hover:from-[#DAA520] hover:to-[#FFD700] text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  Submitted!
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Submit Proposal
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 border-2 border-[#2a2a1a] hover:border-[#B87333] text-[#d8c68e] font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function ProposalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#d8c68e] text-xl">Loading...</div>
      </div>
    }>
      <ProposalContent />
    </Suspense>
  );
}
