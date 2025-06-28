import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { PlusSquareIcon } from "lucide-react";
import { CategoryDialogue } from "./CategoryDialogue";


export default function CategoriesTable({ categories, onDelete, onEdit }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCategories = categories?.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
   

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Categories</h2>
                <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/3"
                />
            </div>
            <div className="flex justify-end mb-4">
                <CategoryDialogue />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[200px]">Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((category, index) => (
                                <TableRow key={category._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onEdit(category)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => onDelete(category._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
