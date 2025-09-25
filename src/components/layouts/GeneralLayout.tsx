import { Header } from './Header';

export function GeneralLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4'>
      <Header />
      <div className='mt-4'>{children}</div>
    </div>
  );
}
