import Navbar from "@/app/components/Navbar";

export default function MyPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
} 