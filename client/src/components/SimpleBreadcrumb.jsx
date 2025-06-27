import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const SimpleBreadcrumb = () => {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    const breadcrumbNameMap = {
        '': 'Dashboard',
        'notes': 'Notes',
        'create': 'Create',
        'edit': 'Edit'
    }

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
            <Link
                to="/"
                className="flex items-center hover:text-foreground transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
                const isLast = index === pathnames.length - 1
                const displayName = breadcrumbNameMap[name] || name

                return (
                    <React.Fragment key={name}>
                        <ChevronRight className="w-4 h-4" />
                        {isLast ? (
                            <span className="text-foreground font-medium">{displayName}</span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="hover:text-foreground transition-colors"
                            >
                                {displayName}
                            </Link>
                        )}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}

export default SimpleBreadcrumb