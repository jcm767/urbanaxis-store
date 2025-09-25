import dynamic from 'next/dynamic';
const CategoryPage = dynamic(() => import('@/app/(catalog)/CategoryPage'), { ssr: false });
export default function WomenAll() { return <CategoryPage gender="women" title="Women — All" />; }
