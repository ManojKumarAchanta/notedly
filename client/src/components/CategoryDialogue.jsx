import { PlusSquareIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateCategoryMutation } from "@/app/services/notesApi";

export function CategoryDialogue() {
    const [name, setName] = useState("");
    const [createCategory, { isLoading }] = useCreateCategoryMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            await createCategory({ name: trimmedName }).unwrap();
            toast.success("Category created successfully");
            setName(""); // reset input after success
        } catch (error) {
            toast.error("Failed to create category");
            console.error(error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary" className="flex items-center">
                    Create Category
                    <PlusSquareIcon className="h-5 w-5 ml-2" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                            Organize your notes by creating a new category. You can add, edit, or delete categories as needed.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="category-name">Name</Label>
                            <Input
                                id="category-name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Work, Personal, Ideas"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : (
                                <>
                                    Create Category
                                    <PlusSquareIcon className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
