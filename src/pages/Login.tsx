import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Command, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/main'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { branding, isReady, isAuthenticated, isAuthSubmitting, signIn, register } = useAppStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loginData, setLoginData] = useState({ email: 'admin@portal.com', password: 'Admin123' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })

  const redirectTo = useMemo(() => {
    const next = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
    return next && next !== '/login' ? next : '/'
  }, [location.state])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  if (isReady && isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await signIn(loginData.email, loginData.password)
      toast({
        title: 'Acesso liberado',
        description: 'Você entrou no portal com sucesso.',
      })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast({
        title: 'Falha no login',
        description: error instanceof Error ? error.message : 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await register(registerData.name, registerData.email, registerData.password)
      toast({
        title: 'Conta criada',
        description: 'Seu acesso foi criado e você já está autenticado.',
      })
      navigate('/', { replace: true })
    } catch (error) {
      toast({
        title: 'Falha no cadastro',
        description: error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,102,255,0.12),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,1)_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-10 lg:flex-row lg:items-center lg:gap-14">
        <section className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ambiente protegido por autenticação
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {branding?.iconUrl ? (
                <img src={branding.iconUrl} alt={branding.name} className="h-12 w-12 rounded-xl object-contain shadow-sm" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <Command className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                  {branding?.subtitle || 'Portal Central'}
                </p>
                <h1 className="text-4xl font-black tracking-tight text-slate-950">
                  {branding?.name || 'Portal de Acesso'}
                </h1>
              </div>
            </div>

            <p className="max-w-lg text-base font-medium leading-7 text-slate-600">
              Entre para acessar as plataformas do workspace, acompanhar logs e ajustar as preferências do portal no mesmo domínio publicado pelo Traefik.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-bold text-slate-900">Login seed</p>
              <p className="mt-1 text-sm text-slate-600">Admin: `admin@portal.com` / `Admin123`</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-bold text-slate-900">Novo ambiente</p>
              <p className="mt-1 text-sm text-slate-600">Se o banco estiver vazio, você pode começar pelo cadastro.</p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-md">
          <Card className="border-white/70 bg-white/90 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">Acessar portal</CardTitle>
              <CardDescription>
                Use sua conta para liberar o carregamento dos módulos e da API real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(value) => setMode(value as 'login' | 'register')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <Label htmlFor="login-email">E-mail</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(event) =>
                          setLoginData((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="voce@empresa.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(event) =>
                          setLoginData((current) => ({ ...current, password: event.target.value }))
                        }
                        placeholder="Sua senha"
                      />
                    </div>

                    <Button className="w-full" disabled={isAuthSubmitting} type="submit">
                      {isAuthSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <LockKeyhole className="mr-2 h-4 w-4" />
                          Entrar no portal
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-6">
                  <form className="space-y-4" onSubmit={handleRegister}>
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome</Label>
                      <Input
                        id="register-name"
                        value={registerData.name}
                        onChange={(event) =>
                          setRegisterData((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="Seu nome"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">E-mail</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(event) =>
                          setRegisterData((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="voce@empresa.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(event) =>
                          setRegisterData((current) => ({ ...current, password: event.target.value }))
                        }
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>

                    <Button className="w-full" disabled={isAuthSubmitting} type="submit">
                      {isAuthSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        'Criar conta e entrar'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <p className="mt-6 text-center text-xs text-slate-500">
                Ao continuar, você acessa os módulos protegidos do portal.{' '}
                <Link className="font-semibold text-primary" to="/">
                  Voltar ao início
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
