"use client"

import type React from "react"

import { useState } from "react"
import { Info, Keyboard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Feature {
  title: string
  description: string
  shortcut?: string
  icon: React.ReactNode
  isNew?: boolean
}

interface FeaturePanelProps {
  features: {
    category: string
    items: Feature[]
  }[]
  mode: string
}

export default function FeaturePanel({ features, mode }: FeaturePanelProps) {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (title: string) => {
    if (favorites.includes(title)) {
      setFavorites(favorites.filter((fav) => fav !== title))
    } else {
      setFavorites([...favorites, title])
    }
  }

  return (
    <div className="h-full w-72 border-l border-gray-200 bg-gray-50 overflow-y-auto">
      <div className="p-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{mode} Features</h3>

        {favorites.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 flex items-center text-sm font-medium text-gray-700">
              <Star className="mr-1 h-4 w-4 text-yellow-500" /> Favorites
            </h4>
            <div className="space-y-2">
              {features
                .flatMap((category) => category.items.filter((item) => favorites.includes(item.title)))
                .map((feature, index) => (
                  <div key={index} className="rounded-lg bg-white shadow-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {feature.icon}
                        <span className="ml-2 text-sm font-medium text-gray-800">{feature.title}</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleFavorite(feature.title)}
                            >
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove from favorites</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {feature.shortcut && (
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <Keyboard className="mr-1 h-3 w-3" />
                        <span>{feature.shortcut}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        <Accordion type="multiple" className="w-full">
          {features.map((category, index) => (
            <AccordionItem key={index} value={`category-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-sm font-medium text-gray-700 py-2">
                {category.category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {category.items.map((feature, featureIndex) => (
                    <div key={featureIndex} className="rounded-lg bg-white shadow-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {feature.icon}
                          <span className="ml-2 text-sm font-medium text-gray-800">{feature.title}</span>
                          {feature.isNew && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              New
                            </span>
                          )}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleFavorite(feature.title)}
                              >
                                <Star
                                  className={`h-3 w-3 ${favorites.includes(feature.title) ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}`}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{favorites.includes(feature.title) ? "Remove from favorites" : "Add to favorites"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{feature.description}</p>
                      {feature.shortcut && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Keyboard className="mr-1 h-3 w-3" />
                          <span>{feature.shortcut}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-4 rounded-lg bg-gray-100 p-4 shadow-md">
          <h4 className="flex items-center text-xs font-medium text-gray-700">
            <Info className="mr-1 h-3 w-3" /> Tips
          </h4>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
            <li>Star features to add them to your favorites</li>
            <li>Use keyboard shortcuts for faster access</li>
            <li>Press '?' anytime for keyboard shortcuts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
