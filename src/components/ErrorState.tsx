import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="py-16 px-6 text-center bg-destructive/5 rounded-xl border border-destructive/20 flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-destructive mb-1">
        Erro ao carregar dados
      </h3>
      <p className="text-sm font-medium text-destructive/80 max-w-sm mb-6">{error}</p>
      {onRetry && (
        <Button
          variant="outline"
          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onRetry}
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Tentar Novamente
        </Button>
      )}
    </div>
  )
}
