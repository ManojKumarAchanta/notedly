

// pages/Dashboard.js - Main dashboard/home page
import React from 'react'
import SimpleBreadcrumb from '@/components/SimpleBreadcrumb'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/app/features/authSlice'

const Dashboard = () => {
    const user = useSelector(selectCurrentUser);
    console.log(user)
    return (
        <div className='w-full h-full'>
            <SimpleBreadcrumb />

            <main className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome {user.username}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link
                        to="/notes"
                        className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-xl font-semibold mb-2">View Notes</h3>
                        <p className="text-muted-foreground">Browse all your notes</p>
                    </Link>

                    <Link
                        to="/notes/create"
                        className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-xl font-semibold mb-2">Create Note</h3>
                        <p className="text-muted-foreground">Add a new note</p>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Dashboard;