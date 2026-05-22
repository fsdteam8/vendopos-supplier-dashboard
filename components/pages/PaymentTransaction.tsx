'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAllSettlements, useRequestForTransfer } from '@/hooks/usePaymentSettlement';
import { Analytics, Settlement } from '@/types/paymentTransfer';
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Loader2,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import PaginationPage from '../ui/PaginationPage';
import { cn } from '../../lib/utils';

const PaymenTransfer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>('');

  const { mutate: requestTransfer, isPending } = useRequestForTransfer();
  const { data: settlementResponse, isLoading, isError } = useAllSettlements();

  const settlementsRaw = settlementResponse?.data ?? settlementResponse;
  const settlements: Settlement[] = Array.isArray(settlementsRaw)
    ? settlementsRaw
    : Array.isArray(settlementsRaw?.data)
      ? settlementsRaw.data
      : Array.isArray(settlementsRaw?.docs)
        ? settlementsRaw.docs
        : [];

  const analyticsCandidateList = [
    settlementResponse?.data?.analytics,
    settlementResponse?.analytics,
    settlementResponse?.data?.data?.analytics,
    settlementResponse?.data?.meta?.analytics,
    settlementResponse?.meta?.analytics,
  ];

  const analytics: Analytics | undefined = analyticsCandidateList.find((a) => !!a) as
    | Analytics
    | undefined;

  const meta = settlementResponse?.data?.meta ?? settlementResponse?.meta;
  const totalPage = meta?.totalPages || 1;
  const itemsPerPage = 10;

  const { paginatedData, totalPages } = useMemo(() => {
    if (isLoading || isError || !Array.isArray(settlements)) {
      return { paginatedData: [], totalPages: 1 };
    }

    const filteredData = status
      ? settlements.filter((s: Settlement) => s.status.toLowerCase() === status.toLowerCase())
      : settlements;

    const total = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    const safePage = Math.min(currentPage, total);
    const data = filteredData.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

    return {
      paginatedData: data,
      totalPages: total,
    };
  }, [currentPage, settlements, status, itemsPerPage, isLoading, isError]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatus('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading payment transfers. Please try again later.
      </div>
    );
  }

  // Filter settlements on client side since the current hook doesn't support params
  const filteredSettlements = status
    ? settlements.filter((s: Settlement) => s.status.toLowerCase() === status.toLowerCase())
    : settlements;

  const handleRequestTransfer = (settlementId: string) => {
    toast.loading('Requesting transfer payment...', {
      id: 'transfer-request',
    });

    requestTransfer(settlementId, {
      onSuccess: (data) => {
        toast.success(data?.message || 'Transfer request submitted successfully', {
          id: 'transfer-request',
        });
      },

      onError: (err: any) => {
        console.log(err);
        toast.error(err?.response?.data?.message || 'Failed to request transfer payment', {
          id: 'transfer-request',
        });
      },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6 mx-auto container space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Total Transferred */}
          <Card className="border border-gray-200 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Total Transferred</p>

                <h2 className="text-3xl font-bold text-gray-900">
                  {analytics?.totalTransferred || 0}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-xl bg-green-50 flex transferred items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="border border-gray-200 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Total Pending</p>

                <h2 className="text-3xl font-bold text-amber-600">
                  {analytics?.totalPending || 0}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          {/* Requested */}
          <Card className="border border-gray-200 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Total Requested</p>

                <h2 className="text-3xl font-bold text-blue-600">
                  {analytics?.totalRequested || 0}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                <Send className="w-7 h-7 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Transfer History</h2>
            <div className="flex items-center gap-3">
              {status && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-red-500"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white text-gray-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {status || 'All'}
                    <ChevronDown className="ml-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange('')}>
                    All Transfers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('transferred')}>
                    Transferred
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('requested')}>
                    Requested
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase whitespace-nowrap">
                      Order ID
                    </TableHead>

                    <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase whitespace-nowrap">
                      Total Amount
                    </TableHead>

                    <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase whitespace-nowrap">
                      Admin Fee
                    </TableHead>

                    <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase whitespace-nowrap">
                      Payable Amount
                    </TableHead>

                    <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center whitespace-nowrap">
                      Transfer Status
                    </TableHead>

                    <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center whitespace-nowrap">
                      Order Status
                    </TableHead>

                    <TableHead className="h-12 px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center whitespace-nowrap">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredSettlements?.map((settlement: Settlement) => (
                    <TableRow
                      key={settlement._id}
                      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Order ID */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {settlement.orderId?.orderUniqueId}
                          </span>

                          <span className="text-xs text-gray-400 mt-1">
                            #{settlement._id?.slice(-6)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">
                          ${settlement.totalAmount}
                        </span>
                      </TableCell>

                      {/* Admin Commission */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="font-medium text-red-600">
                          ${settlement.adminCommission}
                        </span>
                      </TableCell>

                      {/* Payable Amount */}
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <span className="font-semibold text-green-600">
                          ${settlement.payableAmount}
                        </span>
                      </TableCell>

                      {/* Transfer Status */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          className={`capitalize rounded-full border px-3 py-1 text-xs font-medium ${
                            settlement.status === 'transferred'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : settlement.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {settlement.status}
                        </Badge>
                      </TableCell>

                      {/* Order Status */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize rounded-full px-3 py-1 text-xs border',
                            settlement.orderId?.orderStatus === 'delivered' &&
                              'border-green-300 bg-green-50 text-green-800',
                            settlement.orderId?.orderStatus === 'pending' &&
                              'border-yellow-200 bg-yellow-50 text-yellow-700',
                            settlement.orderId?.orderStatus === 'cancelled' &&
                              'border-red-200 bg-red-50 text-red-700',
                            settlement.orderId?.orderStatus !== 'delivered' &&
                              settlement.orderId?.orderStatus !== 'pending' &&
                              settlement.orderId?.orderStatus !== 'cancelled' &&
                              'border-gray-300 bg-gray-50 text-gray-700',
                          )}
                        >
                          {settlement.orderId?.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        {settlement.status === 'pending' && (
                          <Button
                            onClick={() => handleRequestTransfer(settlement.paymentId)}
                            size="sm"
                            className="h-9 rounded-xl bg-[#086646] hover:bg-[#06543f] text-white px-4"
                          >
                            Transaction Request
                          </Button>
                        )}

                        {settlement.status === 'requested' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Request Sent
                          </span>
                        )}

                        {(settlement.status === 'completed' ||
                          settlement.status === 'transferred') && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                            Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredSettlements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-20 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <XCircle className="w-10 h-10 text-gray-300" />

                          <p className="text-sm font-medium">No transfer history found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <PaginationPage
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
            totalItems={settlements.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </main>
  );
};

export default PaymenTransfer;
