'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import messages from '@/messages.json'
import { Mail } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'


export default function Home() {
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-400 text-white'>
    <section className='text-center mb-8 md:mb-12'>
    <h1 className='text-3xl md:text-5xl font-bold animate-pulse'>
      Dive into the World of Mystery Message
    </h1>
    <p className='mt-3 md:mt-4 text-base md:text-large'>
        Mystry Message - Where Your identity never gets revealed    
    </p>
    </section>
    <Carousel plugins={[Autoplay({delay:2000})]}  className="w-full max-w-xs md:max-w-xl">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className='p-4'>
              <Card>
                <CardHeader>
                  <CardTitle>{message.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                <Mail className="flex-shrink-0" />
                  <div>
                    <p>{message.content}</p>
                    <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

    </main>

    <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2024 Mystery Message. All rights reserved.
      </footer>
    </>
  )
}
