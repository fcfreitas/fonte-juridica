import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Importa o tema padrão do Quill
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IntegerType } from 'mongodb';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: true });

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }], // Mantém a configuração padrão
    [{ color: [] }, { background: [] }], // 🎨 Cor do texto e cor de fundo
    ['link'],
  ],
  clipboard: {
    matchVisual: false, // Garante que o Quill respeite a estrutura do HTML
  },
};

const formats = [
  'header', 'bold', 'italic', 'underline', 
  'list', 'bullet', 'link',
  'color', 'background'
];

interface UserTextEditorProps {
  tema: IntegerType;
  value?: string; // Tornar o value opcional
  onChange?: (value: string) => void; // Tornar o onChange opcional
  onCommentPosted: () => void;
}

const UserTextEditor = ({
  tema,
  value = '', // Default vazio se não houver value
  onChange,
  onCommentPosted,
}: UserTextEditorProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState(value); // Inicializa com o value, se existir
  const [loading, setLoading] = useState(false);

  if (session?.user) {
    return <p></p>;  //Apenas administradores podem publicar comentários.
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/publish-user-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, userId: session?.user.id, tema }),
      });

      if (response.ok) {
        setContent(''); // Limpa o editor
        onCommentPosted(); // Atualiza os comentários na página
      } else {
        alert('Erro ao publicar o comentário.');
      }
    } catch (error) {
      console.error('Erro ao publicar o comentário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Se o onChange for fornecido, significa que estamos editando
  const handleChange = (newContent: string) => {
    if (onChange) {
      onChange(newContent); // Se onChange for fornecido, passa a alteração para o componente pai
    }
    setContent(newContent); // Atualiza o conteúdo localmente
  };

  return (
    <div className="user-editor">
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="mb-4"
        placeholder="Escreva aqui sua anotações..."
      />
      
      {/* Exibe o botão apenas para novas publicações */}
      {!value && (
        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-neutral-400 text-white rounded"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      )}
    </div>
  );
};

export default UserTextEditor;
