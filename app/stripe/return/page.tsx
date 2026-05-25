'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, CreditCard, ShieldCheck, Zap, Loader2 } from 'lucide-react';

const steps = [
  {
    icon: ShieldCheck,
    title: 'Identity Verified',
    description: 'Your identity has been securely confirmed by Stripe.',
  },
  {
    icon: CreditCard,
    title: 'Payout Account Linked',
    description: 'Your bank account is connected and ready to receive payments.',
  },
  {
    icon: Zap,
    title: 'Payments Activated',
    description: 'You can now receive payouts from your sales directly.',
  },
];

export default function StripeReturnPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf8] via-white to-[#ecfdf5] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-[#09714e]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 rounded-full bg-[#0aa06e]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#09714e]/5 blur-3xl pointer-events-none" />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-10 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ boxShadow: '0 32px 80px rgba(9,113,78,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/logo.svg" alt="VendoPos Logo" width={56} height={56} />
          </Link>
        </div>

        {/* Success icon with pulse ring */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#09714e]/20 animate-ping scale-110" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#09714e] to-[#0aa06e] flex items-center justify-center shadow-lg shadow-[#09714e]/30">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Onboarding Complete! 🎉
          </h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Your Stripe account is fully set up. You&apos;re ready to start receiving payments
            directly to your bank account.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl bg-[#f0fdf8] border border-[#09714e]/10 transition-all duration-500`}
                style={{ transitionDelay: `${(i + 1) * 150}ms` }}
              >
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#09714e]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#09714e]" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#09714e] ml-auto mt-0.5 shrink-0" />
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <Link href="/?page=payments">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#09714e] to-[#0aa06e] text-white font-semibold text-sm shadow-md shadow-[#09714e]/25 hover:shadow-lg hover:shadow-[#09714e]/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
            Go to Payments Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>

        {/* Auto-redirect notice */}
        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          Redirecting to dashboard in{' '}
          <span className="font-semibold text-[#09714e]">{countdown}s</span>
        </p>
      </div>

      {/* Footer note */}
      <p className="relative z-10 mt-8 text-xs text-gray-400 text-center max-w-sm leading-relaxed">
        Powered by{' '}
        <span className="font-semibold text-gray-500">Stripe</span>. Your financial information is
        encrypted and secure.
      </p>
    </div>
  );
}
