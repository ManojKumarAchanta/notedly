import { useGetAllCategoriesQuery } from '@/app/services/notesApi'
import CategoriesTable from '@/components/CategoryTable'
import React from 'react'

const CategoriesPage = () => {
    const { data: categories, isLoading, isError } = useGetAllCategoriesQuery();
    if (isLoading) {
        return <div>Loading...</div>
    }
    const onEdit = (category) => {
        // Handle edit logic here
        console.log("Edit category:", category);
    }
    const onDelete = (categoryId) => {
        // Handle delete logic here
        console.log("Delete category with ID:", categoryId);
    }
    if (isError) {
        return <div>Error loading categories</div>
    }
    return (
        <div>
            <CategoriesTable categories={categories} onEdit={onEdit} onDelete={onDelete} />
        </div>
    )
}

export default CategoriesPage