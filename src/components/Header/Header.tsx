import { Download, Moon, Plus, Sun, Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onCreate: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function Header({ onCreate, onExport, onImport }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-app/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
            Job Board
          </p>
          <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
            Pipeline de candidaturas
          </h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-border p-2.5 text-muted transition hover:bg-muted-bg hover:text-foreground"
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <label className="cursor-pointer rounded-xl border border-border p-2.5 text-muted transition hover:bg-muted-bg hover:text-foreground">
            <Upload className="h-4 w-4" />
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImport(file);
                e.target.value = '';
              }}
            />
            <span className="sr-only">Importar JSON</span>
          </label>

          <button
            type="button"
            onClick={onExport}
            className="rounded-xl border border-border p-2.5 text-muted transition hover:bg-muted-bg hover:text-foreground"
            aria-label="Exportar JSON"
            title="Exportar JSON"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova vaga</span>
            <kbd className="ml-1 hidden rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-normal lg:inline">
              Ctrl+N
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
