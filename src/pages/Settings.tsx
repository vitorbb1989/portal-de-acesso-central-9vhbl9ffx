import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências de conta e sistema.</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-subtle border-border/50">
          <CardHeader>
            <CardTitle>Perfil de Usuário</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais visíveis no portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue="Arthur Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <Input id="email" defaultValue="arthur.silva@acmecorp.com" disabled />
              </div>
            </div>
            <Button className="mt-4">Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-border/50">
          <CardHeader>
            <CardTitle>Preferências do Sistema</CardTitle>
            <CardDescription>Personalize sua experiência no Portal Central.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas quando houver instabilidade em sistemas favoritos.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Modo Escuro (Beta)</Label>
                <p className="text-sm text-muted-foreground">
                  Altera toda a interface para cores escuras. (Oculto na sidebar por padrão)
                </p>
              </div>
              <Switch disabled />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Abertura de Links</Label>
                <p className="text-sm text-muted-foreground">
                  Abrir plataformas em uma nova aba automaticamente.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings
