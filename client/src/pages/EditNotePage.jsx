// pages/EditNotePage.js - Edit note page
import React from 'react'
import EditNoteForm from '@/components/EditNoteForm'
import SimpleBreadcrumb from '@/components/SimpleBreadcrumb'
import { useParams } from 'react-router-dom'

const EditNotePage = () => {
    const { id } = useParams()

    return (
        <div className='w-full h-full'>
            <SimpleBreadcrumb />

            <main className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Note</h1>
                    <p className="text-muted-foreground">Modify your note</p>
                </div>

                <EditNoteForm noteId={id} />
            </main>
        </div>
    )
}

export default EditNotePage