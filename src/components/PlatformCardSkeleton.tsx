import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function PlatformCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <Card
      className={cn('h-full flex flex-col bg-card border-border shadow-sm animate-fade-in')}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </CardHeader>
      <CardContent className="p-5 pt-2 flex-grow flex flex-col">
        <Skeleton className="h-5 w-3/4 mb-2.5" />
        <Skeleton className="h-3.5 w-full mb-1.5" />
        <Skeleton className="h-3.5 w-4/5 mb-4 flex-grow" />
        <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
