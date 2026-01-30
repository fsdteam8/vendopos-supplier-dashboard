'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SearchX, Home, MoveLeft, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Not Found Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-primary/10 rounded-full">
          <SearchX className="w-12 h-12 text-primary" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-pulse duration-2000" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-7xl font-black tracking-tighter text-primary/20">
            404
          </h1>
          <h2 className="text-2xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-xs mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Go back
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto gap-2 text-white bg-[#09714E] hover:bg-[#09714E]/90"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go back home
            </Link>
          </Button>
        </div>

        {/* Footer Link */}
        <div className="pt-8 border-t border-border/50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <MoveLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}