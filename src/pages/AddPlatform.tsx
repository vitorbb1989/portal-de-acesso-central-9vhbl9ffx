import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Platform, PlatformStatus } from '@/lib/mock-data'
import { PlatformCard } from '@/components/PlatformCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Box,
  Globe,
  Shield,
  Database,
  Cloud,
  Terminal,
  Activity,
  Users,
  Mail,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS = [
  { name: 'Box', icon: Box },
  { name: 'Globe', icon: Globe },
  { name: 'Shield', icon: Shield },
  { name: 'Database', icon: Database },
  { name: 'Cloud', icon: Cloud },
  { name: 'Terminal', icon: Terminal },
  { name: 'Activity', icon: Activity },
  { name: 'Users', icon: Users },
  { name: 'Mail', icon: Mail },
  { name: 'Message', icon: MessageSquare },
  { name: 'Dashboard', icon: LayoutDashboard },
]

const THEME_COLORS = [
  { name: 'Tech Blue', value: '#0066FF' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Amber', value: '#F59E0B' },
]

const CATEGORIES = ['Marketing', 'DevTools', 'CRM', 'Infra', 'Comunicação']

const AddPlatform = () => {
  const navigate = useNavigate()
  const { addPlatform } = useAppStore()
  const { toast } = useToast()
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<Platform>({
    id: crypto.randomUUID(),
    name: '',
    url: '',
    description: '',
    category: 'Infra',
    status: 'online',
    icon: Globe,
    color: '#0066FF',
    lastAccessed: 'Nunca',
    hasAccess: true,
  })

  const handleNext = () => setStep((s) => Math.min(s + 1, 3))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleComplete = () => {
    addPlatform(formData)
    toast({
      title: 'Plataforma adicionada',
      description: `${formData.name || 'Nova plataforma'} foi integrada ao workspace.`,
    })
    navigate('/')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative pb-12">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />

      <div className="pt-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Adicionar Plataforma</h1>
        <p className="text-muted-foreground">
          Configure os parâmetros da nova plataforma para integração imediata ao workspace.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium transition-colors duration-300',
                step === s
                  ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,102,255,0.3)]'
                  : step > s
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground bg-secondary/50',
              )}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  'w-12 h-[2px] mx-2 transition-colors duration-300',
                  step > s ? 'bg-primary/50' : 'bg-border',
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <Card className="shadow-elevation border-border/50 bg-white/50 backdrop-blur-sm relative overflow-hidden flex flex-col min-h-[420px]">
            <div className="p-6 flex-grow">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Plataforma</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Analytics Pro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL de Acesso</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Descrição</Label>
                    <Textarea
                      id="desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Breve descrição da utilidade..."
                      className="resize-none h-20"
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-semibold mb-4">Identidade Visual</h2>

                  <div className="space-y-3">
                    <Label>Ícone</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {ICONS.map((ico, idx) => {
                        const Icon = ico.icon
                        const isSelected = formData.icon === Icon
                        return (
                          <button
                            key={idx}
                            onClick={() => setFormData({ ...formData, icon: Icon })}
                            className={cn(
                              'flex items-center justify-center p-3 rounded-xl border transition-all duration-200',
                              isSelected
                                ? 'border-primary bg-primary/5 text-primary shadow-[0_0_12px_rgba(0,102,255,0.15)]'
                                : 'border-border bg-white hover:border-primary/40 hover:bg-secondary/50 text-muted-foreground hover:text-foreground hover:shadow-sm',
                            )}
                          >
                            <Icon className="w-6 h-6" />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label>Cor de Destaque</Label>
                    <div className="flex gap-4">
                      {THEME_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setFormData({ ...formData, color: c.value })}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all duration-200',
                            formData.color === c.value
                              ? 'scale-110 shadow-[0_0_10px_rgba(0,0,0,0.2)] border-white ring-2 ring-primary/30'
                              : 'border-transparent hover:scale-105 shadow-sm opacity-80 hover:opacity-100',
                          )}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-semibold mb-4">Revisão e Status</h2>

                  <div className="space-y-3">
                    <Label>Status Inicial</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v: PlatformStatus) => setFormData({ ...formData, status: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Operacional</SelectItem>
                        <SelectItem value="warning">Instável</SelectItem>
                        <SelectItem value="offline">Manutenção / Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-secondary/30 rounded-xl border border-border/50 space-y-3 text-sm">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Nome da Plataforma</span>
                      <span className="font-medium">{formData.name || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">URL</span>
                      <span className="font-medium">{formData.url || 'Não informada'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Categoria</span>
                      <span className="font-medium">{formData.category}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-secondary/10 border-t border-border/50 flex justify-between items-center mt-auto">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 1}
                className="hover:shadow-sm transition-shadow"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
              </Button>
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="shadow-[0_4px_14px_0_rgba(0,102,255,0.25)] hover:shadow-[0_6px_20px_rgba(0,102,255,0.4)] transition-all"
                >
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="shadow-[0_4px_14px_0_rgba(16,185,129,0.25)] bg-status-success hover:bg-status-success/90 hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all text-white"
                >
                  <Check className="w-4 h-4 mr-2" /> Concluir
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 flex flex-col">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center">
              <Box className="w-4 h-4 mr-2" /> Preview em Tempo Real
            </h3>
            <div className="pointer-events-none w-full shadow-elevation rounded-xl">
              <PlatformCard
                id={formData.id}
                title={formData.name}
                description={formData.description}
                icon={formData.icon}
                status={formData.status}
                category={formData.category}
                accessLevel="full"
                url={formData.url}
                index={0}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-6 bg-secondary/30 p-3 rounded-lg border border-dashed border-border/60">
              O card será exibido com este visual na dashboard e nas listagens. Os efeitos de
              elevação e brilho se adaptam ao status e cor escolhidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPlatform
