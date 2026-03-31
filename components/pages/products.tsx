"use client";

import { useProducts } from "@/app/features/products/hooks/useProducts";
import { Product } from "@/app/features/products/types";
import { useProfile } from "@/app/features/profile/hooks/useProfile";
import { AddProductModal } from "@/components/ui/add-product-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductTable } from "@/components/ui/product-table";
import { StatCard } from "@/components/ui/stat-card";
import { Box, Plus, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function Products() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  const [onboarding, setOnboarding] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } = useProducts(params);
  const analyticsData = data?.data?.analytics;
  const { data: profile } = useProfile();

  const products = data?.data?.data || [];
  const isOnboarded = profile?.data?.stripeOnboardingCompleted;

  const handleStripeOnboarding = () => {
    if (isOnboarded) {
      setEditingProduct(null);
      setShowAddModal(true);
    } else {
      setOnboarding(true);
    }
  };

  const handleSetupPayment = () => {
    router.push("/?page=payments");
    setOnboarding(false);
  };

  const stats = useMemo(
    () => [
      {
        label: "Total Products",
        value: `${analyticsData?.totalProducts || "0"}`,
        icon: Box,
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        label: "Total Orders",
        value: `${analyticsData?.totalOrder || "0"} units`,
        icon: TrendingUp,
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ],
    [analyticsData],
  );

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage and add new products to your inventory
          </p>
        </div>
        <button
          onClick={handleStripeOnboarding}
          className="flex items-center gap-2 px-6 py-3 bg-[#09714e] text-white rounded-lg hover:bg-[#0a6f58] transition-colors font-medium text-sm cursor-pointer"
          aria-label="Add new product"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ProductTable
          products={products}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          totalItems={analyticsData?.totalProducts}
          externalPage={params.page}
          onRequestPage={(p) => setParams((prev) => ({ ...prev, page: p }))}
          onEdit={(product) => {
            setEditingProduct(product);
            setShowAddModal(true);
          }}
        />
      </div>

      <Dialog open={onboarding} onOpenChange={setOnboarding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payments & Transactions Required</DialogTitle>
            <DialogDescription>
              You need to complete your Stripe onboarding before adding
              products.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-[#1B7D6E] cursor-pointer hover:bg-[#155D5C] text-white"
              onClick={handleSetupPayment}
            >
              SetUp Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showAddModal && (
        <AddProductModal
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            refetch();
            setEditingProduct(null);
          }}
          product={editingProduct}
        />
      )}
    </div>
  );
}
