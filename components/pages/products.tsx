"use client";

import { useState } from "react";
import { AddProductModal } from "@/components/ui/add-product-modal";
import { ProductTable } from "@/components/ui/product-table";
import { Plus } from "lucide-react";
import { useProducts } from "@/app/features/products/hooks/useProducts";
import { Product } from "@/app/features/products/types";
import { useProfile } from "@/app/features/profile/hooks/useProfile";
import { is } from "date-fns/locale/is";
import { se } from "date-fns/locale";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Products() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
const router = useRouter();

  const [onboarding, setOnboarding] = useState(false);
  const { data, isLoading, isError, refetch } = useProducts();
  const { data: profile } = useProfile();

  const products = data?.data || [];
  const isOnboarded = profile?.data.stripeOnboardingCompleted;
  console.log("is onboraded", isOnboarded);
  const handelstripeOnboarding = () => {

    if (isOnboarded) {
      setEditingProduct(null);
      setShowAddModal(true);
    }else {
     setOnboarding(true);
    }
  };
  const handelsetupPayment = () => {
    router.push('/?page=payments');
    setOnboarding(false);
  }

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
          onClick={() => {
           handelstripeOnboarding();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#1B7D6E] text-white rounded-lg hover:bg-[#155D5C] transition-colors font-medium text-sm"
          aria-label="Add new product"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Pass products data or empty array safely */}
        <ProductTable
          products={data?.data || []}
          isLoading={isLoading}
          isError={isError}
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
              You need to complete your Stripe onboarding before adding products.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-[#1B7D6E] cursor-pointer hover:bg-[#155D5C] text-white"
              onClick={handelsetupPayment}
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
