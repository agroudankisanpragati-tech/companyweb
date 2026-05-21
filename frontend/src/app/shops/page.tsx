import ShopSearch from "../../components/ShopSearch";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata = {
    title: "Shops - Agroudan",
};

export default function ShopsPage() {
    return (
        <>
            <Navbar />

            <main className="section-container py-8">
                <h1 className="text-2xl font-bold mb-4">Shops Near You</h1>

                <p className="text-sm text-gray-600 mb-6">Explore nearby agribusinesses and suppliers.</p>

                {/* show a few shops */}
                <ShopSearch limit={6} />

                <div className="mt-6 flex justify-center">
                    <a href="/shops/all" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:shadow-lg">View more</a>
                </div>
            </main>

            <Footer />
        </>
    );
}
