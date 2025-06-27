import React from 'react'
import NotesTable from '@/components/NotesTable'
import SimpleBreadcrumb from '@/components/SimpleBreadcrumb'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const NotesPage = () => {
    return (
        <div className='w-full h-full'>
            <SimpleBreadcrumb />

            <main className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Notes</h1>
                        <p className="text-muted-foreground">Manage all your notes</p>
                    </div>

                    <Link
                        to="/notes/create"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Note
                    </Link>
                </div>

                <NotesTable />
            </main>
        </div>
    )
}

export default NotesPage