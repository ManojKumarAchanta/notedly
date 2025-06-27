import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Home, FileText, Plus, Settings, LogOut } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { useDispatch } from 'react-redux'
import { logout } from '@/app/features/authSlice'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const toggleDesktopSidebar = () => {
        const newState = !isDesktopSidebarCollapsed
        setIsDesktopSidebarCollapsed(newState)

        // Dispatch custom event for Layout component
        window.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { isCollapsed: newState }
        }))
    }
    const dispatch = useDispatch();
    const handleLogout = () => {
        // Add your logout logic here (clear tokens, redux state, etc.)
        // For example:
        try {
            dispatch(logout());
            toast.success('Logged out successfully!')
            localStorage.removeItem('authToken')
            navigate('/auth')
        } catch (error) {
            toast.error('Logout failed. Please try again.')
            console.error('Logout failed:', error);
        }

        // Redirect to auth page
    }

    const navigationItems = [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'Notes', href: '/notes', icon: FileText },
        { name: 'Create Note', href: '/notes/create', icon: Plus },
    ]

    const isActive = (href) => {
        if (href === '/') {
            return location.pathname === '/'
        }
        return location.pathname.startsWith(href)
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`fixed left-0 top-0 z-50 h-screen bg-card border-r transition-all duration-300 hidden md:block ${isDesktopSidebarCollapsed ? 'w-16' : 'w-64'
                }`}>
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        {!isDesktopSidebarCollapsed && (
                            <h2 className="text-lg font-semibold">Notes App</h2>
                        )}
                        <button
                            onClick={toggleDesktopSidebar}
                            className="p-2 rounded-md hover:bg-accent"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                        }`}
                                    title={isDesktopSidebarCollapsed ? item.name : ''}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!isDesktopSidebarCollapsed && (
                                        <span className="ml-3">{item.name}</span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom section with theme toggle and logout */}
                    <div className="p-4 border-t space-y-2">
                        {/* Theme Toggle */}
                        <div className={`flex items-center ${isDesktopSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                            {!isDesktopSidebarCollapsed && (
                                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                            )}
                            <ModeToggle />
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            title={isDesktopSidebarCollapsed ? 'Logout' : ''}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isDesktopSidebarCollapsed && (
                                <span className="ml-3">Logout</span>
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b md:hidden">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-lg font-semibold">Notes App</h1>
                    <div className="flex items-center space-x-2">
                        <ModeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md hover:bg-accent"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed top-16 left-0 right-0 bg-card border-b shadow-lg">
                        <nav className="p-4 space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </Link>
                                )
                            })}

                            {/* Mobile Logout Button */}
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false)
                                    handleLogout()
                                }}
                                className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar