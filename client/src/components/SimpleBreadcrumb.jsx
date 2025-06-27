// components/SimpleBreadcrumb.jsx
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { setActiveView } from "@/app/features/uiSlice";
import { Home, FileText, Plus, Edit } from "lucide-react";

const SimpleBreadcrumb = () => {
    const activeView = useSelector((state) => state.ui.activeView);
    const dispatch = useDispatch();

    const handleNavigation = (view) => {
        dispatch(setActiveView(view));
    };

    const getBreadcrumbConfig = () => {
        switch (activeView) {
            case "list":
                return {
                    items: [
                        { label: "Home", icon: Home, current: true }
                    ]
                };
            case "create":
                return {
                    items: [
                        { label: "Home", icon: Home, view: "list" },
                        { label: "Create Note", icon: Plus, current: true }
                    ]
                };
            case "edit":
                return {
                    items: [
                        { label: "Home", icon: Home, view: "list" },
                        { label: "Edit Note", icon: Edit, current: true }
                    ]
                };
            default:
                return {
                    items: [
                        { label: "Home", icon: Home, current: true }
                    ]
                };
        }
    };

    const { items } = getBreadcrumbConfig();

    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <BreadcrumbItem>
                            {item.current ? (
                                <BreadcrumbPage className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleNavigation(item.view)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default SimpleBreadcrumb;