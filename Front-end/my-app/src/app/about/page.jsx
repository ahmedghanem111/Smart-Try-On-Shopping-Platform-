import Navbar from "../components/home/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">
            من نحن
          </h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                رؤيتنا
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                نحن شركة رائدة في مجال التكنولوجيا، نسعى لتقديم أفضل الحلول والمنتجات 
                التي تلبي احتياجات عملائنا وتساعدهم على تحقيق أهدافهم.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                مهمتنا
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                مهمتنا هي تطوير منتجات مبتكرة وعالية الجودة تساعد في تحسين حياة الناس 
                وتسهيل أعمالهم اليومية من خلال استخدام أحدث التقنيات.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                قيمنا
              </h2>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• الابتكار والإبداع</li>
                <li>• الجودة والتميز</li>
                <li>• خدمة العملاء</li>
                <li>• الشفافية والنزاهة</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}