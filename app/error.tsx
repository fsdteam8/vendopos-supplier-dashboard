'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCcw, Home, MoveLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Error Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-destructive/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div className="absolute inset-0 rounded-full border-4 border-destructive/20 border-t-destructive animate-spin duration-1000" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Oops!
          </h1>
          <h2 className="text-2xl font-semibold text-foreground/80">
            Something went wrong
          </h2>
          <p className="text-muted-foreground text-lg max-w-xs mx-auto">
            {error.message || "An unexpected error occurred. Don't worry, it's not you, it's us."}
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded-md inline-block">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => reset()}
            size="lg"
            className="w-full sm:w-auto gap-2 text-white bg-[#09714E] hover:bg-[#09714E]/90"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go back home
            </Link>
          </Button>
        </div>

        {/* Footer Link */}
        <div className="pt-8">
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
