import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import { NavigationMenu } from '@radix-ui/react-navigation-menu'

const Layout = ({ children }) => {
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile and listen for sidebar state changes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Listen for sidebar toggle events (you can dispatch custom events from Navbar)
    const handleSidebarToggle = (event) => {
      setIsDesktopSidebarCollapsed(event.detail.isCollapsed)
    }

    window.addEventListener('sidebarToggle', handleSidebarToggle)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('sidebarToggle', handleSidebarToggle)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Toaster position='top-right' />
      <Navbar />

      {/* Main content area - responsive to sidebar state */}
      <main className={`min-h-screen transition-all duration-300 ${isMobile
        ? 'pt-16' // Mobile: account for fixed header height
        : isDesktopSidebarCollapsed
          ? 'ml-16' // Desktop collapsed: smaller left margin
          : 'ml-64' // Desktop expanded: full left margin
        }`}>
        <div className="h-full flex flex-col">
          {/* Navigation Menu */}
          <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <NavigationMenu />
            </div>
          </div>

          {/* Page content */}
          <div className="flex-1 w-full px-6 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="h-full max-w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default Layout