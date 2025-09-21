import { Tabs } from '@/components/common/Tabs';
import { FaBook } from 'react-icons/fa';
import { MdArticle } from 'react-icons/md';

export function HomePageTabs() {
  return (
    <Tabs
      tabs={[
        {
          icon: FaBook,
          id: 'book',
          label: 'Book'
        },
        {
          icon: MdArticle,
          id: 'article',
          label: 'Article'
        }
      ]}
      activeTab='book'
    />
  );
}
