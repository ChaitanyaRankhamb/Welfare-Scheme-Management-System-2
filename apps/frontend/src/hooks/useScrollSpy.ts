import { useState, useEffect, useCallback } from 'react'

export function useScrollSpy(ids: string[], offset: number = 250) {
  const [activeSection, setActiveSection] = useState(ids[0] || '')

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = ids.map(id => document.getElementById(id))
      const scrollPosition = window.scrollY + offset

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i]
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(ids[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ids, offset])

  const scrollToSection = useCallback((id: string, customOffset: number = 150) => {
    const el = document.getElementById(id)
    if (el) {
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - customOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  return { activeSection, scrollToSection }
}
