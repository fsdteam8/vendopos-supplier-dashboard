"use client"

import { useState } from "react"
import { AddProductModal } from "@/components/ui/add-product-modal"
import { ProductTable } from "@/components/ui/product-table"
import { Plus } from "lucide-react"
import { useProducts } from "@/app/features/products/hooks/useProducts"
import { Product } from "@/app/features/products/types"

export default function Products() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { data, isLoading, isError, refetch } = useProducts()

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage and add new products to your inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowAddModal(true)
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
            setEditingProduct(product)
            setShowAddModal(true)
          }}
        />
      </div>

      {showAddModal && (
        <AddProductModal 
          onClose={() => {
            setShowAddModal(false)
            setEditingProduct(null)
          }} 
          onSuccess={() => {
             refetch()
             setEditingProduct(null) 
          }}
          product={editingProduct}
        />
      )}
    </div>
  )
}
