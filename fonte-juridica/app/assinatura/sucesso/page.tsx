import { Suspense } from 'react';
import SucessoContent from './sucessoContent';

export default function SucessoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SucessoContent />
    </Suspense>
  );
}
