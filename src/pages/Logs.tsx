import { useAppStore } from '@/stores/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'

const Logs = () => {
  const { logs } = useAppStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Logs de Acesso</h1>
        <p className="text-muted-foreground">
          Histórico de acessos recentes às plataformas integradas.
        </p>
      </div>

      <Card className="overflow-hidden shadow-subtle border-border/50">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead className="w-[200px]">Usuário</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Endereço IP</TableHead>
              <TableHead className="text-right">Data/Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                    {log.platform}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{log.ip}</TableCell>
                <TableCell className="text-right text-muted-foreground">{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default Logs
