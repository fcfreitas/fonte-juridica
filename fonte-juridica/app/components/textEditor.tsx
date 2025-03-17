import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Importa o tema padrão do Quill
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: true });

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link'
];

const AdminTextEditor = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState('<p>Escreva aqui...</p>');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (session?.user?.role !== 'admin') {
    return <p>Apenas administradores podem publicar comentários.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/publish-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, userId: session.user.id }),
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert('Erro ao publicar o texto.');
      }
    } catch (error) {
      console.error('Erro ao publicar o texto:', error);
      alert('Erro ao publicar o texto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-editor border p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Incluir Comentários</h2>
      <ReactQuill value={content} onChange={setContent} modules={modules} formats={formats} className="mb-4" />
      <button type="submit" disabled={loading} onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Publicando...' : 'Publicar'}
      </button>
    </div>
  );
};

export default AdminTextEditor;
