import { NotebookPenIcon } from "lucide-react";

export default function LeftSide() {
    return (<div className="flex items-center hidden my-auto md:block justify-center px-10 py-16 text-foreground">
        <h1 className="text-4xl font-semibold flex items-center gap-2 text-primary mb-4">
            Notedly
            <NotebookPenIcon className="w-8 h-8 text-primary" />
        </h1>
        <h2 className="text-3xl font-semibold mb-2">Organize your thoughts.</h2>
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
            Notedly lets you capture ideas, manage tasks, and reflect freely — all in one place.
            Whether it’s a quick to-do or a rich research note, your content is saved securely and
            accessible anytime, anywhere.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Rich-text editing with tags, colors, and attachments</li>
            <li>Cloud sync across all your devices</li>
            <li>Privacy-first — your notes stay yours</li>
        </ul>
    </div>);
}