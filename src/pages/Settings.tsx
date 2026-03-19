import { useAppStore, NavigationPreference } from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const Settings = () => {
  const { navigationPreference, setNavigationPreference } = useAppStore()

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

            <div className="space-y-3">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">
                  Preferência de Abertura de Plataformas
                </Label>
                <p className="text-sm text-muted-foreground">
                  Defina o comportamento global ao clicar nos cards de sistemas.
                </p>
              </div>
              <RadioGroup
                value={navigationPreference}
                onValueChange={(v) => setNavigationPreference(v as NavigationPreference)}
                className="flex flex-col space-y-2 mt-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="pref-default" />
                  <Label htmlFor="pref-default" className="font-normal">
                    Padrão do Sistema <span className="text-muted-foreground">(recomendado)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="always_new_tab" id="pref-new-tab" />
                  <Label htmlFor="pref-new-tab" className="font-normal">
                    Sempre em Nova Guia
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="always_internal" id="pref-internal" />
                  <Label htmlFor="pref-internal" className="font-normal">
                    Sempre no Visualizador Interno
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings
