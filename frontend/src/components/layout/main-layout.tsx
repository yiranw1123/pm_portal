import { ReactNode } from "react"
import { cn } from "@/styles/theme"
import { Button } from "@/components/ui/button"

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center">
          <div className="w-64">
            <div className="p-4">
              <Button variant="ghost" className="justify-start w-full text-xl font-bold tracking-tight hover:bg-transparent">
                PM Portal
              </Button>
            </div>
          </div>
          <div className="flex-1"></div>
        </div>
      </header>
      <main className="pt-14">
        {children}
      </main>
    </div>
  )
} 