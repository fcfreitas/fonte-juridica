import { useState, useMemo, useCallback, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AdminTextEditor = () => {
  const { data: session } = useSession();
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);  // Estado para controlar a montagem

  const router = useRouter();

  // Garantir que o código só execute no lado do cliente
  useEffect(() => {
    setMounted(true);  // Marca o componente como montado
  }, []);

  // Verifica se o usuário é administrador
  if (session?.user?.role !== "admin") {
    return <p>{session?.user?.role}</p>;
  }

  // Atualiza o conteúdo do editor
  const handleChange = (newValue: any) => {
    setValue(newValue);
  };

  // Envia o conteúdo para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/publish-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: value,  // Salva o conteúdo do editor como JSON
          userId: session.user.id,
        }),
      });

      if (response.ok) {
        router.push("");  // Redireciona para a página dos julgados
      } else {
        alert("Erro ao publicar o texto. na caixa de texto");
      }
    } catch (error) {
      console.error("Erro ao publicar o texto:", error);
      alert("Erro ao publicar o texto.");
    } finally {
      setLoading(false);
    }
  };

  // Espera a montagem do componente para renderizar o conteúdo
  if (!mounted) {
    return null; // Retorna null enquanto o componente não estiver montado
  }

  return (
    <div className="admin-editor">
      <h2>Incluir comentários</h2>
      <form onSubmit={handleSubmit}>
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <Editable placeholder="Escreva aqui..." />
        </Slate>
        <button type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Publicar Texto"}
        </button>
      </form>
    </div>
  );
};

export default AdminTextEditor;
