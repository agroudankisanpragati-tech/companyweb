import ShopSearch from "../../../components/ShopSearch";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export const metadata = {
    title: "All Shops - Agroudan",
};

export default function AllShopsPage() {
    return (
        <>
            <Navbar />

            <main className="section-container py-8">
                <h1 className="text-2xl font-bold mb-4">All Shops</h1>
                <p className="text-sm text-gray-600 mb-6">Search and browse all registered shops.</p>

                {/* client component handles fetching and searching */}
                <ShopSearch />
            </main>

            <Footer />
        </>
    );
}
