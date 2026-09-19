import { useState } from 'react'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  src?: string | null
  alt: string
  className?: string
}

/** Logo with a placeholder for the many entries where TheSportsDB has no badge (null or broken URL). */
export function BadgeImage({ src, alt, className }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const broken = !src || failedSrc === src

  if (broken) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('flex items-center justify-center rounded-full bg-muted text-muted-foreground', className)}
      >
        <Shield className="size-1/2" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={cn('object-contain', className)}
    />
  )
}
