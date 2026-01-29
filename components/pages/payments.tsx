"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  useOnboarding,
  useGetStripeLink,
  useRefreshOnboarding,
} from "@/app/features/onboarding/hooks/use-onboarding";
import { useProfile } from "@/app/features/profile/hooks/useProfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { is } from "date-fns/locale";
import { on } from "events";

const mockTransactions = [
  {
    id: "TX-001",
    date: "2024-01-20",
    amount: "$1,200.00",
    status: "completed",
    type: "credit",
    method: "Bank Transfer",
    description: "Payout for Order #ORD-8822",
  },
  {
    id: "TX-002",
    date: "2024-01-18",
    amount: "$450.00",
    status: "pending",
    type: "credit",
    method: "Stripe",
    description: "Payment for Order #ORD-8823",
  },
  {
    id: "TX-003",
    date: "2024-01-15",
    amount: "$3,500.00",
    status: "completed",
    type: "credit",
    method: "Bank Transfer",
    description: "Monthly Payout - December",
  },
  {
    id: "TX-004",
    date: "2024-01-10",
    amount: "$89.00",
    status: "failed",
    type: "debit",
    method: "Credit Card",
    description: "Subscription Fee - Premium Plan",
  },
  {
    id: "TX-005",
    date: "2024-01-05",
    amount: "$220.00",
    status: "completed",
    type: "credit",
    method: "PayPal",
    description: "Refund Adjustment",
  },
];

export default function Payments() {
  const { mutate: createOnboarding, isPending: isCreating } = useOnboarding();
  const { mutate: getStripeLink, isPending: isGettingLink } =
    useGetStripeLink();
  const { mutate: refreshOnboarding, isPending: isRefreshing } =
    useRefreshOnboarding();

  const { data: profile } = useProfile();
  const isOnboarded = profile?.data.stripeOnboardingCompleted;
  const stats = useMemo(
    () => [
      {
        label: "Total Balance",
        value: "$12,450.00",
        icon: DollarSign,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        label: "Pending Payouts",
        value: "$1,840.50",
        icon: Clock,
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        label: "Successful Transactions",
        value: "48",
        icon: ArrowUpRight,
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Active Plan",
        value: "Pro Vendor",
        icon: CreditCard,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
    ],
    [],
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payments & Transactions
          </h1>
          <p className="text-gray-500">
            Track your earnings and transaction history
          </p>
        </div>
        {isOnboarded  ?  <Button
          onClick={() => createOnboarding()}
          disabled={isCreating}
          className="cursor-pointer"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Go To Payment Dashboard"
          )}
        </Button> : (
          <Button
            onClick={() => createOnboarding()}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Payout Settings"
            )}
          </Button>
        )}
        {/* <Button
          onClick={() => createOnboarding()}
          disabled={isCreating}
          className="cursor-pointer"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Payout Settings"
          )}
        </Button> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <button className="text-sm font-medium text-primary hover:underline">
            Download CSV
          </button>
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
                <TableCell className="font-medium text-gray-900">
                  {tx.id}
                </TableCell>
                <TableCell className="text-gray-600">{tx.date}</TableCell>
                <TableCell className="text-gray-600 max-w-xs truncate">
                  {tx.description}
                </TableCell>
                <TableCell className="text-gray-600">{tx.method}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "font-semibold",
                      tx.type === "credit"
                        ? "text-emerald-600"
                        : "text-red-600",
                    )}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {tx.amount}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOnboarded === false} modal={false}>
        <DialogContent className="sm:max-w-md shadow-2xl border-primary/20" showOverlay={false} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Stripe Onboarding Incomplete</DialogTitle>
            <DialogDescription>
              Your Stripe onboarding is not completed. Please complete it to
              enable payouts and manage your transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-red-600 font-medium">
              Note: You cannot receive payouts until your account is fully
              verified.
            </p>
          </div>
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => refreshOnboarding()}
              disabled={isRefreshing}
              className="flex-1"
            >
              {isRefreshing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
            <Button
              onClick={() => getStripeLink()}
              disabled={isGettingLink}
              className="flex-1 bg-[#1B7D6E] hover:bg-[#155D5C]"
            >
              {isGettingLink ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Go to Payment Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
