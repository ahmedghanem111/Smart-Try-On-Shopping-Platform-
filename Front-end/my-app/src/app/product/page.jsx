import Navbar from "../components/home/Navbar";

export default function Products() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">
            منتجاتنا
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* يمكنك إضافة المنتجات هنا */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                منتج 1
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                وصف المنتج الأول
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                منتج 2
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                وصف المنتج الثاني
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                منتج 3
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                وصف المنتج الثالث
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}