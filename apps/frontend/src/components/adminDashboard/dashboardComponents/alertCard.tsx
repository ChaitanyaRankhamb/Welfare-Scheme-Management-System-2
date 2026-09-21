import React from 'react'
import Link from 'next/link'

interface AlertCardProps {
  title: string
  description: string
  link: string
  linkText: string
  color: 'destructive' | 'primary' | 'primary'
}

export const AlertCard = ({
  title,
  description,
  link,
  linkText,
  color,
}: AlertCardProps) => {
  const colorStyles = {
    rose: {
      border: 'border-destructive/30 dark:border-destructive/20',
      text: 'text-destructive hover:text-destructive',
    },
    orange: {
      border: 'border-destructive/30 dark:border-destructive/20',
      text: 'text-destructive hover:text-destructive',
    },
    emerald: {
      border: 'border-primary/30 dark:border-primary/20',
      text: 'text-primary hover:text-primary',
    },
  }

  return (
    <div
      className={`
      snap-start
      min-h-[90px]
      flex flex-col justify-center
      p-3 rounded-xl
      bg-card/70 dark:bg-card/100 backdrop-blur-md
      border ${colorStyles[color].border}
      shadow-lg
      transition-all duration-300
      hover:-translate-y-0.5
    `}
    >
      <p className="text-sm font-semibold text-muted-foreground dark:text-primary-foreground">
        {title}
      </p>

      <p className="text-[11px] text-muted-foreground mt-1">
        {description}
      </p>

      <Link
        href={link}
        className={`mt-1 text-[11px] font-semibold ${colorStyles[color].text}`}
      >
        {linkText} →
      </Link>
    </div>
  )
}