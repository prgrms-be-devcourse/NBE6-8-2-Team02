import AdminNavbar from "@/app/components/AdminNavbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AdminNavbar />
            {children}
        </>
    );
} 