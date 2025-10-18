'use client'

import { FloatingHeader } from '@/components/floating-header'
import { NavigationLink } from '@/components/navigation-link'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import { LINKS, PROFILES } from '@/lib/constants'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [textVisible, setTextVisible] = useState([false, false, false])
  const [photosVisible, setPhotosVisible] = useState([false, false, false])
  const aboutRef = useRef()
  const photosRef = useRef()

  // Intersection Observer for text animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Text fade in with delay
            setTimeout(() => setTextVisible([true, false, false]), 200)
            setTimeout(() => setTextVisible([true, true, false]), 600)
            setTimeout(() => setTextVisible([true, true, true]), 1000)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (aboutRef.current) {
      observer.observe(aboutRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Intersection Observer for photo animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Photos slide up with staggered delay
            setTimeout(() => setPhotosVisible([true, false, false]), 100)
            setTimeout(() => setPhotosVisible([true, true, false]), 300)
            setTimeout(() => setPhotosVisible([true, true, true]), 500)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (photosRef.current) {
      observer.observe(photosRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Kaan Kılıçarslan" />
      <div className="content-wrapper">
        <div className="content">
          {/* About Me Section with Fade In Animation */}
          <div ref={aboutRef} className="space-y-4 mb-8">
            <PageTitle title="About me" />
            
            <p className={`mb-4 transition-all duration-800 ${
              textVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              I am a senior Geomatics Engineering student at Hacettepe University and currently working as a software development scholar at TÜBİTAK Space, contributing to a GIS project. My career goal is to pursue a future in the space industry, combining my engineering background with innovative software solutions.
            </p>
            
            <p className={`mb-4 transition-all duration-800 ${
              textVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              In 2018, I founded Sphere Unit, a creative media initiative where I currently manage a team of five professional video editors to deliver a wide range of media solutions for clients. Alongside this, I have been creating content and teaching Adobe software since 2018, specializing as an After Effects instructor. Since 2024, I have also been working as a professional travel photographer, capturing urban and cultural stories across different cities and countries.
            </p>
            
            <p className={`mb-4 transition-all duration-800 ${
              textVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              Additionally, I gained experience as a Web Designer at İTÜ Blockchain, and I actively contribute to my department's community, KOBIT, as a Design Creator. These voluntary experiences have strengthened my collaborative mindset, enhanced my creativity, and helped me develop new perspectives while working with diverse groups of people.
            </p>
          </div>

          {/* Photo Grid - 3:4 aspect ratio */}
          <div ref={photosRef} className="mb-8 grid grid-cols-3 gap-4">
            <img 
              src="/me/pc.avif" 
              alt="PC Setup" 
              className={`w-full aspect-[3/4] object-cover rounded-lg transition-all duration-700 ${
                photosVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            />
            <img 
              src="/me/photo.avif" 
              alt="Photography" 
              className={`w-full aspect-[3/4] object-cover rounded-lg transition-all duration-700 ${
                photosVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            />
            <img 
              src="/me/event.avif" 
              alt="Event" 
              className={`w-full aspect-[3/4] object-cover rounded-lg transition-all duration-700 ${
                photosVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            />
          </div>

          <div className="lg:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.filter((x) => x.href !== '/').map((link) => (
                <NavigationLink key={link.href} href={link.href} label={link.label} icon={link.icon} />
              ))}
            </div>
            <hr />
            <div className="flex flex-col gap-1">
              {Object.values(PROFILES).map((profile) => (
                <NavigationLink key={profile.url} href={profile.url} label={profile.title} icon={profile.icon} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
