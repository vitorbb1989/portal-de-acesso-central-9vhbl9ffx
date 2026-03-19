import { Box } from 'lucide-react'

export function EmptyState({ message = 'Nenhum resultado encontrado.' }: { message?: string }) {
  return (
    <div className="py-16 px-6 text-center bg-secondary/30 rounded-xl border border-dashed border-border flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Box className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-foreground mb-1">Nada por aqui</h3>
      <p className="text-sm font-medium text-muted-foreground max-w-sm">{message}</p>
    </div>
  )
}
