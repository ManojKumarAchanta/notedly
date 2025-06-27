import React from 'react'
import CreateNoteForm from '@/components/CreateNoteForm'
import SimpleBreadcrumb from '@/components/SimpleBreadcrumb'

const CreateNotePage = () => {
    return (
        <div className='w-full h-full'>
            <SimpleBreadcrumb />

            <main className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Note</h1>
                    <p className="text-muted-foreground">Add a new note to your collection</p>
                </div>

                <CreateNoteForm />
            </main>
        </div>
    )
}

export default CreateNotePage