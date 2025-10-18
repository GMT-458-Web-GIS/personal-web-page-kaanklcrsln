import { FloatingHeader } from '@/components/floating-header'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import OpenLayersMap from '@/components/openlayers-map'

export const metadata = {
  title: 'Travel Gallery'
}

export default function Gallery() {
  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Travel Gallery" />
      <div className="content-wrapper">
        <div className="content">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-gray-900">Travel Gallery</h1>
            <span className="flex items-center gap-3">
              <img 
                src="/Animated-Flag-South-Korea.gif" 
                alt="South Korea Flag" 
                className="w-8 h-6 object-cover rounded"
              />
              <span className="text-2xl font-semibold text-gray-700"></span>
            </span>
          </div>
          
          <div className="mt-4">
            <OpenLayersMap />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}