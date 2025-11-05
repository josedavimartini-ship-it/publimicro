"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Calendar, Clock, User, Phone, Mail, X, Check, AlertCircle } from "lucide-react";

interface ScheduleVisitModalProps {
  propertyId: string;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ScheduleVisitModal({
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
  onSuccess,
}: ScheduleVisitModalProps) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form fields
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [message, setMessage] = useState('');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to schedule a visit');
      }

      // Create visit request
      const { data, error: visitError } = await supabase
        .from('visits')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          scheduled_date: selectedDate,
          scheduled_time: selectedTime,
          visitor_name: visitorName,
          visitor_phone: visitorPhone,
          visitor_email: visitorEmail,
          message: message,
          status: 'pending', // Will need confirmation
        })
        .select()
        .single();

      if (visitError) throw visitError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to schedule visit');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#2a2a1a] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#B87333] mb-1">Schedule a Visit</h2>
            <p className="text-sm text-[#676767]">{propertyTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a1a] rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-[#676767]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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
                <p className="text-green-500 font-semibold mb-1">Visit Scheduled Successfully!</p>
                <p className="text-sm text-green-400">
                  You will receive a confirmation email shortly. The property owner will confirm your visit.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Preferred Date *
                </label>
                <input
                  required
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Preferred Time *
                </label>
                <select
                  required
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visitor Information */}
            <div>
              <label className="block text-sm font-semibold text-[#d8c68e] mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </label>
              <input
                required
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d8c68e] mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                Additional Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Any questions or special requests..."
                className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
              />
            </div>

            {/* Important Notice */}
            <div className="bg-[#B87333]/10 border border-[#B87333]/30 rounded-lg p-4">
              <p className="text-sm text-[#d8c68e]">
                <strong className="text-[#B87333]">Important:</strong> After the property owner confirms your visit 
                and you complete it, you will be able to submit a proposal for this property.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 bg-gradient-to-r from-[#B87333] to-[#DAA520] hover:from-[#DAA520] hover:to-[#FFD700] text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scheduling...
                  </>
                ) : success ? (
                  <>
                    <Check className="w-5 h-5" />
                    Scheduled!
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    Schedule Visit
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 border-2 border-[#2a2a1a] hover:border-[#B87333] text-[#d8c68e] font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
