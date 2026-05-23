'use client';

import { onboardService } from '@/app/features/onboarding/api';
import { useGetStripeLink, useOnboarding } from '@/app/features/onboarding/hooks/use-onboarding';
import { useProfile } from '@/app/features/profile/hooks/useProfile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatCard } from '@/components/ui/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Clock, CreditCard, DollarSign, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import { Button } from '../ui/button';

type PollingHandlerProps = {
  shouldPoll: boolean;
  onReady: () => void;
  onError: (msg: string) => void;
  setForceClose: (v: boolean) => void;
};

function PollingHandler({ shouldPoll, onReady, onError, setForceClose }: PollingHandlerProps) {
  useEffect(() => {
    if (!shouldPoll) return;

    let stopped = false;

    const check = async () => {
      try {
        const res = await onboardService.refreshOnboarding();

        // Defensive checks: look for account object
        const account = res?.data?.account ?? res?.account ?? null;

        const detailsSubmitted = !!account?.details_submitted;
        const chargesEnabled = !!account?.charges_enabled;
        const payoutsEnabled =
          !!account?.payouts_enabled || !!account?.payouts_enabled === false
            ? !!account?.payouts_enabled
            : !!account?.payouts_enabled;

        // Consider ready when key Stripe flags are true
        if (detailsSubmitted && chargesEnabled && payoutsEnabled) {
          if (!stopped) {
            onReady();
            setForceClose(true);
          }
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to poll';
        onError(msg);
      }
    };

    // immediate check then interval
    check();
    const iv = setInterval(check, 5000);

    return () => {
      stopped = true;
      clearInterval(iv);
    };
  }, [shouldPoll, onReady, onError, setForceClose]);

  return null;
}

const mockTransactions = [
  {
    id: 'TX-001',
    date: '2024-01-20',
    amount: '$1,200.00',
    status: 'completed',
    type: 'credit',
    method: 'Bank Transfer',
    description: 'Payout for Order #ORD-8822',
  },
  {
    id: 'TX-002',
    date: '2024-01-18',
    amount: '$450.00',
    status: 'pending',
    type: 'credit',
    method: 'Stripe',
    description: 'Payment for Order #ORD-8823',
  },
  {
    id: 'TX-003',
    date: '2024-01-15',
    amount: '$3,500.00',
    status: 'completed',
    type: 'credit',
    method: 'Bank Transfer',
    description: 'Monthly Payout - December',
  },
  {
    id: 'TX-004',
    date: '2024-01-10',
    amount: '$89.00',
    status: 'failed',
    type: 'debit',
    method: 'Credit Card',
    description: 'Subscription Fee - Premium Plan',
  },
  {
    id: 'TX-005',
    date: '2024-01-05',
    amount: '$220.00',
    status: 'completed',
    type: 'credit',
    method: 'PayPal',
    description: 'Refund Adjustment',
  },
];

export default function Payments() {
  const { mutate: createOnboarding, isPending: isCreating } = useOnboarding();
  const { mutate: getStripeLink, isPending: isGettingLink } = useGetStripeLink();

  // Local UI state for polling
  const [pollingState, setPollingState] = useState<{
    loading: boolean;
    error?: string | null;
    ready?: boolean;
  }>({ loading: false, error: null, ready: false });
  const [forceCloseModal, setForceCloseModal] = useState(false);
  const [onboardingErrorMessage, setOnboardingErrorMessage] = useState<string | null>(null);

  const { data: profile } = useProfile();

  const profileData = profile?.data;

  const stripeAccountId = profileData?.stripeAccountId;
  const isOnboarded = profileData?.stripeOnboardingCompleted;

  const stats = useMemo(
    () => [
      {
        label: 'Total Balance',
        value: '$12,450.00',
        icon: DollarSign,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
      },
      {
        label: 'Pending Payouts',
        value: '$1,840.50',
        icon: Clock,
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
      },
      {
        label: 'Successful Transactions',
        value: '48',
        icon: ArrowUpRight,
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
      },
      {
        label: 'Active Plan',
        value: 'Pro Vendor',
        icon: CreditCard,
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
      },
    ],
    [],
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Completed</Badge>
        );
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // STRIPE STATES
  const noStripeAccount = !stripeAccountId;
  const needsOnboarding = Boolean(stripeAccountId && isOnboarded === false);
  const canAccessDashboard = Boolean(stripeAccountId && isOnboarded === true);

  // Reset forceCloseModal when conditions change so modal can reopen if needed
  useEffect(() => {
    // Only reset if we're back to needing onboarding (i.e., not in error state)
    if (onboardingErrorMessage === null && (needsOnboarding || canAccessDashboard)) {
      setForceCloseModal(false);
    }
  }, [stripeAccountId, onboardingErrorMessage, needsOnboarding, canAccessDashboard]);

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
          <p className="text-gray-500">Track your earnings and transaction history</p>
        </div>

        {/* ✅ FIXED STRIPE BUTTON FLOW */}
        {noStripeAccount && (
          <Button onClick={() => createOnboarding()} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Payout Settings'
            )}
          </Button>
        )}

        {needsOnboarding && (
          <Button onClick={() => createOnboarding()} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue Stripe Setup'
            )}
          </Button>
        )}

        {canAccessDashboard && (
          <Button onClick={() => getStripeLink()} disabled={isGettingLink}>
            {isGettingLink ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              'Go to Payment Dashboard'
            )}
          </Button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <button className="text-sm font-medium text-primary hover:underline">Download CSV</button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mockTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium text-gray-900">{tx.id}</TableCell>
                <TableCell className="text-gray-600">{tx.date}</TableCell>
                <TableCell className="text-gray-600 max-w-xs truncate">{tx.description}</TableCell>
                <TableCell className="text-gray-600">{tx.method}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'font-semibold',
                      tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600',
                    )}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {tx.amount}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Persistent onboarding alert shown when server returns the 500 'not completed' error */}
      {onboardingErrorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Please complete onboarding</AlertTitle>
          <AlertDescription>
            {onboardingErrorMessage}
            <div className="mt-3">
              <Button
                onClick={() => {
                  createOnboarding();
                  setOnboardingErrorMessage(null);
                }}
                className="bg-[#1B7D6E] text-white"
              >
                Continue Setup
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* MODAL (SAFE ONLY FOR ONBOARDING) */}
      <Dialog
        open={!forceCloseModal && (needsOnboarding || canAccessDashboard)}
        onOpenChange={(isOpen) => {
          // When user tries to close via X button or ESC, update state
          if (!isOpen) {
            setForceCloseModal(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-md shadow-2xl border-primary/20">
          <DialogHeader>
            <DialogTitle>
              {canAccessDashboard ? 'Payment Account Ready' : 'Payment Setup In Progress'}
            </DialogTitle>

            <DialogDescription className="text-sm text-gray-600 leading-relaxed">
              {canAccessDashboard
                ? 'Your Stripe account is fully verified and ready to use.'
                : 'Your Stripe account has been created, but onboarding is not fully completed yet.'}
            </DialogDescription>
          </DialogHeader>

          {/* IF NOT COMPLETED */}
          {needsOnboarding && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-amber-800">
                  Why you are seeing this message
                </p>

                <ul className="text-sm text-amber-700 list-disc pl-5 space-y-1">
                  <li>Stripe account created successfully</li>
                  <li>Verification is still pending</li>
                  <li>Payouts are not enabled yet</li>
                </ul>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-sm text-gray-600">Please verify to continue.</p>
              </div>
            </>
          )}

          {/* IF READY */}
          {canAccessDashboard && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-emerald-800">Your account is fully active</p>

              <p className="text-sm text-emerald-700">
                You can now access Stripe dashboard and manage payouts.
              </p>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between gap-2">
            {/* CASE 1: NOT ONBOARDED */}
            {needsOnboarding && (
              <div className="flex-1">
                <Button
                  onClick={async () => {
                    // Call getStripeLink to continue setup flow (open link)
                    try {
                      setPollingState({ loading: true, error: null });
                      const res = await onboardService.getStripeLink();

                      // Log full response for debugging
                      console.log('[Verify Now] Full API response:', res);

                      // Success path: open url if returned
                      if (res?.success && res?.data?.url) {
                        console.log('[Verify Now] Success - opening URL:', res.data.url);
                        window.open(res.data.url, '_blank');
                        setPollingState({ loading: false, ready: false, error: null });
                        sonnerToast.success(res.message || 'Opened onboarding link');
                      } else if (res?.success === false && res?.statusCode === 500) {
                        // Specific StripeInvalidRequestError path from server when login link cannot be created
                        console.log('[Verify Now] 500 Error detected:', res);
                        setPollingState({ loading: false, error: 'stripe_invalid', ready: false });
                        // Prefer detailed error from errorSource if present
                        const errorSourceMsg =
                          Array.isArray(res?.errorSource) && res.errorSource.length > 0
                            ? res.errorSource.map((e: any) => e.message).join('; ')
                            : null;

                        const userMsg =
                          errorSourceMsg ||
                          res?.message ||
                          'Cannot create a login link for an account that has not completed onboarding.';

                        console.log('[Verify Now] User message:', userMsg);

                        // Close the modal and show a persistent in-page alert so user can restart onboarding
                        setForceCloseModal(true);
                        setOnboardingErrorMessage(userMsg);
                        // Also show a toast
                        sonnerToast.error(userMsg);
                      } else {
                        console.log('[Verify Now] Unknown response shape:', res);
                        setPollingState({
                          loading: false,
                          error: res?.message || 'unknown',
                          ready: false,
                        });
                        sonnerToast.error(res?.message || 'Unknown response');
                      }
                    } catch (err: any) {
                      console.log('[Verify Now] Catch error:', err);
                      console.log('[Verify Now] Error response:', err?.response?.data);
                      setPollingState({
                        loading: false,
                        error: err?.response?.data?.message || err?.message || 'Failed',
                        ready: false,
                      });
                      sonnerToast.error(
                        err?.response?.data?.message || err?.message || 'Failed to get stripe link',
                      );
                    }
                  }}
                  disabled={isCreating || pollingState.loading}
                  className="w-full bg-[#1B7D6E] hover:bg-[#155D5C]"
                >
                  {pollingState.loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  Verify Now
                </Button>
              </div>
            )}

            {/* CASE 2: ONBOARDED COMPLETE  DASHBOARD BUTTON */}
            {canAccessDashboard && (
              <div className="w-full">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-emerald-800">
                    Congratulations — verification complete
                  </p>
                  <p className="text-sm text-emerald-700">Your Stripe account is now verified.</p>
                </div>

                <Button
                  onClick={() => setForceCloseModal(true)}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            )}
          </DialogFooter>

          {/* Polling effect: start polling when the modal opens and account needs onboarding */}
          {needsOnboarding && (
            <>
              <PollingHandler
                shouldPoll={needsOnboarding}
                onReady={() => {
                  // When ready, set local state so UI can react; parent profile hook should update and close modal.
                  setPollingState({ loading: false, ready: true, error: null });
                }}
                onError={(errMessage: string) => {
                  setPollingState({ loading: false, error: errMessage });
                }}
                setForceClose={setForceCloseModal}
              />

              {/* If we detected stripe invalid request, show message asking to complete onboarding. */}
              {pollingState.error === 'stripe_invalid' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded">
                  <p className="text-sm text-red-700">
                    Please complete your onboarding on Stripe. Click "Continue Setup" to open the
                    onboarding link.
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
