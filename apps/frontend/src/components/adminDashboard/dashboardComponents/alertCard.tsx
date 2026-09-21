import React from 'react'
import Link from 'next/link'

interface AlertCardProps {
  title: string
  description: string
  link: string
  linkText: string
  color: 'rose' | 'orange' | 'emerald'
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
      border: 'border-rose-200/30 dark:border-rose-900/20',
      text: 'text-rose-600 hover:text-rose-500',
    },
    orange: {
      border: 'border-orange-200/30 dark:border-orange-900/20',
      text: 'text-orange-600 hover:text-orange-500',
    },
    emerald: {
      border: 'border-emerald-200/30 dark:border-emerald-900/20',
      text: 'text-emerald-600 hover:text-emerald-500',
    },
  }

  return (
    <div
      className={`
      snap-start
      min-h-[90px]
      flex flex-col justify-center
      p-3 rounded-xl
      bg-white/70 dark:bg-zinc-900/100 backdrop-blur-md
      border ${colorStyles[color].border}
      shadow-[0_6px_15px_-5px_rgba(0,0,0,0.15)]
      transition-all duration-300
      hover:-translate-y-0.5
    `}
    >
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </p>

      <p className="text-[11px] text-gray-500 mt-1">
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