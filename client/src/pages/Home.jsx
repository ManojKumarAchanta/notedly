import CreateNoteForm from '@/components/CreateNoteForm';
import EditNoteForm from '@/components/EditNoteForm';
import NotesTable from '@/components/NotesTable';
import SimpleBreadcrumb from '@/components/SimpleBreadcrumb';
import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const activeView = useSelector((state) => state.ui.activeView);

    const renderContent = () => {
        switch (activeView) {
            case "list":
                return <NotesTable />;
            case "create":
                return <CreateNoteForm />;
            case "edit":
                return <EditNoteForm />;
            default:
                return <p>Select a view from the sidebar.</p>;
        }
    };

    return (
        <div className='w-full h-full '>
            {/* Breadcrumb Navigation */}
            <SimpleBreadcrumb />

            {/* Main Content */}
            <main>{renderContent()}</main>
        </div>
    );
};

export default Home;