import ShopSearch from "../../components/ShopSearch";
import GoBackButton from '../../components/GoBackButton';

export const metadata = {
    title: "Shops - Agroudan",
};

export default function ShopsPage() {
    

    return (
        <>
            <main className="section-container py-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Shops Near You</h1>
                    <GoBackButton />
                </div>

                <p className="text-sm text-gray-600 mb-6">Explore nearby shops and suppliers.</p>

                {/* show a few shops */}
                <ShopSearch limit={6} />

                <div className="mt-6 flex justify-center">
                    <a href="/shops/all" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:shadow-lg">View more</a>
                </div>
            </main>

        </>
    );
}
