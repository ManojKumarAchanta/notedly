import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Menu, X, FileText, Archive, Tag, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { ModeToggle } from "./mode-toggle.jsx"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet.jsx"
import { Button } from "./ui/button.jsx"
import { Link } from 'react-router-dom'
import { isAuthenticated, logout } from "../app/features/authSlice.js"

export default function Navbar() {
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const dispatch = useDispatch()
    const authenticated = useSelector(isAuthenticated)

    // Check if screen is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const closeMobileSheet = () => setIsMobileSheetOpen(false)
    const toggleDesktopSidebar = () => {
        const newState = !isDesktopCollapsed
        setIsDesktopCollapsed(newState)

        // Dispatch custom event to inform Layout component
        window.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { isCollapsed: newState }
        }))
    }

    const handleLogout = () => {
        dispatch(logout())
        if (isMobile) {
            closeMobileSheet()
        }
    }

    const navigationItems = [
        {
            title: "All Notes",
            icon: FileText,
            href: "/dashboard",
            active: true
        },
        {
            title: "Archived",
            icon: Archive,
            href: "/archived",
            active: false
        }
    ]

    const SidebarContent = ({ isMobileSheet = false, isCollapsed = false }) => (
        <div className="flex h-full flex-col bg-background">
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between">
                {!isCollapsed && (
                    <Link
                        to="/"
                        className="text-lg font-semibold"
                        onClick={isMobileSheet ? closeMobileSheet : undefined}
                    >
                        Notedly
                    </Link>
                )}

                {/* Desktop collapse toggle */}
                {!isMobileSheet && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDesktopSidebar}
                        className="h-8 w-8 p-0"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {authenticated ? (
                        <>
                            {navigationItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.title}
                                        to={item.href}
                                        onClick={isMobileSheet ? closeMobileSheet : undefined}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${item.active
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                            } ${isCollapsed ? 'justify-center' : ''}`}
                                        title={isCollapsed ? item.title : undefined}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </Link>
                                )
                            })}

                            {/* Pinned Section */}
                            {!isCollapsed && (
                                <div className="mt-6">
                                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Pinned
                                    </h3>
                                </div>
                            )}

                            {/* Tags Section */}
                            {!isCollapsed && (
                                <div className="mt-6">
                                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Tags
                                    </h3>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                to="/login"
                                onClick={isMobileSheet ? closeMobileSheet : undefined}
                                className={`block rounded-md px-3 py-2 text-sm border-2 border-black text-center font-medium hover:bg-accent hover:text-accent-foreground ${isCollapsed ? 'px-2' : ''
                                    }`}
                            >
                                {isCollapsed ? 'L' : 'Login'}
                            </Link>
                            <Link
                                to="/signup"
                                onClick={isMobileSheet ? closeMobileSheet : undefined}
                                className={`block rounded-md px-3 py-2 text-sm text-center border-black border-2 font-medium hover:bg-accent hover:text-accent-foreground ${isCollapsed ? 'px-2' : ''
                                    }`}
                            >
                                {isCollapsed ? 'S' : 'Sign Up'}
                            </Link>
                        </div>
                    )}
                </nav>
            </div>

            {/* Footer with Logout and Mode Toggle */}
            <div className="border-t p-3">
                <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
                    {authenticated ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className={`flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${isCollapsed ? 'w-8 h-8 p-0' : ''
                                }`}
                            title={isCollapsed ? 'Logout' : undefined}
                        >
                            <LogOut className="h-4 w-4" />
                            {!isCollapsed && <span>Logout</span>}
                        </Button>
                    ) : (
                        <div></div>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-background border-r transition-all duration-300 ${isDesktopCollapsed ? 'md:w-16' : 'md:w-64'
                }`}>
                <SidebarContent isCollapsed={isDesktopCollapsed} />
            </aside>

            {/* Mobile Header with Menu Button */}
            <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
                <Link to="/" className="text-lg font-semibold">
                    Notedly
                </Link>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SidebarContent isMobileSheet={true} />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Main Content Area Spacer for Desktop */}
            <div className={`hidden md:block md:flex-shrink-0 transition-all duration-300 ${isDesktopCollapsed ? 'md:w-16' : 'md:w-64'
                }`}>
            </div>
        </>
    )
}