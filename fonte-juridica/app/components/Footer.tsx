export default function Footer() {
    return (
      <footer className="bg-ink-900 text-ink-200 py-6 border-t border-brass-900/40">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            <span className="font-serif text-paper">Jus<span className="text-brass-400">dex</span></span>
            {" "}— © {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    )
}
