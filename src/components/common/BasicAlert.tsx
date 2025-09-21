import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';

export function BasicAlert({
  variant,
  title,
  description
}: {
  variant: 'destructive' | 'default';
  title: string;
  description: string;
}) {
  return (
    <Alert variant={variant}>
      {variant === 'destructive' ? <MdErrorOutline size={18} /> : <IoIosInformationCircleOutline size={18} />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
