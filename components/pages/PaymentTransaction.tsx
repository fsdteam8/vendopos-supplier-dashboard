'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronDown,
  Loader2,
  Filter,
  RotateCcw,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Send,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAllSettlements } from '@/hooks/usePaymentSettlement';
import { Analytics, Settlement } from '@/types/paymentTransfer';
import PaginationPage from '../ui/PaginationPage';

const PaymenTransfer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>('');

  const { data: settlementResponse, isLoading, isError } = useAllSettlements();

  // Normalize the API response to ensure `settlements` is always an array.
  // Some endpoints return `{ data: [...] }`, others return `[...]` or `{ docs: [...] }`.
  const settlementsRaw = settlementResponse?.data ?? settlementResponse;
  const settlements: Settlement[] = Array.isArray(settlementsRaw)
    ? settlementsRaw
    : Array.isArray(settlementsRaw?.data)
      ? settlementsRaw.data
      : Array.isArray(settlementsRaw?.docs)
        ? settlementsRaw.docs
        : [];

  const analytics: Analytics | undefined = settlementResponse?.analytics;
  console.log('settlements', settlementsRaw);

  const meta = settlementResponse?.meta;
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

  const handleTransaction = (settlement: Settlement) => {
    // Implement the logic to handle transaction details view
    console.log('Transaction details for settlement:', settlement);
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

              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
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
                          className="capitalize rounded-full border-gray-300 bg-gray-50 text-gray-700 px-3 py-1 text-xs"
                        >
                          {settlement.orderId?.orderStatus}
                        </Badge>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        {settlement.orderId?.paymentStatus === 'paid' ? (
                          <span className="text-sm text-gray-400 font-medium">Completed</span>
                        ) : (
                          <Button
                            onClick={() => handleTransaction(settlement)}
                            size="sm"
                            className="h-9 rounded-xl bg-[#086646] hover:bg-[#06543f] text-white px-4"
                          >
                            Transaction Request
                          </Button>
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
