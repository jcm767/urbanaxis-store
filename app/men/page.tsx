import dynamic from 'next/dynamic';
const CategoryPage = dynamic(() => import('@/app/(catalog)/CategoryPage'), { ssr: false });
export default function MenAll() { return <CategoryPage gender="men" title="Men — All" />; }
