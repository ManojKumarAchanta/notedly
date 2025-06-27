import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";  // import useNavigate and useParams
import { useEffect } from "react";
import { setActiveView } from "@/app/features/uiSlice";
import { Home } from "lucide-react";
import { Plus } from "lucide-react";
import { Edit } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
// ... other imports

const SimpleBreadcrumb = () => {
    const activeView = useSelector((state) => state.ui.activeView);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { noteId } = useParams(); // get noteId from URL

    // Redirect to "list" if on "edit" view but no noteId in URL
    useEffect(() => {
        if (activeView === "edit" && !noteId) {
            dispatch(setActiveView("list"));  // update state to list
            navigate("/");                   // redirect to home or list page
        }
    }, [activeView, noteId, dispatch, navigate]);

    const handleNavigation = (view) => {
        dispatch(setActiveView(view));
        if (view === "list") {
            navigate("/"); // navigate home/list when clicking Home breadcrumb
        }
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
            <BreadcrumbList className="flex items-center space-x-2">
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