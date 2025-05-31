"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, RefreshCcw, Wand2 } from "lucide-react"

interface AIWritingAssistantProps {
  currentText: string
  onInsertText: (text: string) => void
}

export default function AIWritingAssistant({ currentText, onInsertText }: AIWritingAssistantProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [characters, setCharacters] = useState<{ name: string; description: string }[]>([])
  const [plotIdeas, setPlotIdeas] = useState<string[]>([])
  const [customPrompt, setCustomPrompt] = useState("")
  const [customResponse, setCustomResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [paraphrasedText, setParaphrasedText] = useState("")

  // Mock AI generation on component mount
  useEffect(() => {
    generateSuggestions()
    generateCharacters()
    generatePlotIdeas()
  }, [])

  const generateSuggestions = () => {
    setIsGenerating(true)
    // Simulate AI response delay
    setTimeout(() => {
      setSuggestions([
        "The rain tapped against the window like fingers of a ghost, calling him to memories he'd rather forget.",
        "He closed his eyes, letting the sound wash over him like a familiar melody from childhood.",
        "Something about the rhythm of raindrops always brought her face back to him, clear as the day she left.",
      ])
      setIsGenerating(false)
    }, 1000)
  }

  const generateCharacters = () => {
    setIsGenerating(true)
    // Simulate AI response delay
    setTimeout(() => {
      setCharacters([
        {
          name: "Elias Thorne",
          description: "A reclusive novelist with a mysterious past, haunted by the disappearance of his wife.",
        },
        {
          name: "Lyra Winters",
          description: "A perceptive detective with synesthesia who sees sounds as colors, giving her unique insights.",
        },
        {
          name: "Marcus Reed",
          description:
            "A charming antiquarian with extensive knowledge of local history and a collection of rare artifacts.",
        },
        {
          name: "Sophia Chen",
          description: "A brilliant botanist studying rare plants with potential healing properties.",
        },
      ])
      setIsGenerating(false)
    }, 1000)
  }

  const generatePlotIdeas = () => {
    setIsGenerating(true)
    // Simulate AI response delay
    setTimeout(() => {
      setPlotIdeas([
        "A mysterious letter arrives from someone thought dead for over a decade.",
        "The protagonist discovers a hidden room in their house containing artifacts from a stranger's life.",
        "An unexpected visitor brings news that changes everything the character thought they knew about their past.",
        "A rare book purchased at an estate sale contains marginalia that appears to predict future events.",
        "During a storm, the power goes out and when it returns, subtle things in the house have changed position.",
      ])
      setIsGenerating(false)
    }, 1000)
  }

  const generateCustomResponse = () => {
    if (!customPrompt.trim()) return

    setIsGenerating(true)
    setCustomResponse("")

    // Simulate AI response delay
    setTimeout(() => {
      setCustomResponse(
        customPrompt.includes("setting")
          ? "The small coastal town of Mirepoint sits perched on rocky cliffs overlooking a temperamental sea. Victorian houses with weather-worn facades line narrow streets that wind up from the harbor. A perpetual mist hangs in the air, blurring the boundaries between the physical world and what might lie beyond. The lighthouse at the point stands as both beacon and warning—its light cutting through fog that locals say never fully lifts from the northern cove."
          : customPrompt.includes("character")
            ? "Eleanor Blackwood, 42, is a botanical illustrator who returned to her hometown after twenty years away. Her precision with a brush contrasts with the chaos of her thoughts. She wears practical clothes in muted colors, moves deliberately, and speaks rarely but with careful consideration. A small scar above her right eyebrow raises questions she never answers. Though polite, she keeps everyone at a distance, except for the elderly bookshop owner who seems to know more about her past than he reveals."
            : "The manuscript appeared ordinary at first glance—leather-bound, slightly worn at the corners, with pages yellowed by time. But as Thomas turned to page 42, he noticed something odd: handwritten notes in the margin that seemed to be responding to his thoughts rather than the text itself. 'Look behind the painting,' it said in elegant script that hadn't been there moments before. Thomas glanced up at the portrait of his grandfather that had hung in his study for decades, suddenly seeing it with new eyes.",
      )
      setIsGenerating(false)
    }, 1500)
  }

  const handleParaphraseRequest = () => {
    if (!selectedText.trim()) return

    setIsGenerating(true)

    // Simulate AI response delay
    setTimeout(() => {
      setParaphrasedText("The rainfall continued once more. Its cadence evoked memories within him...")
      setIsGenerating(false)
    }, 1000)
  }

  return (
    <Tabs defaultValue="continue">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="continue">Continue</TabsTrigger>
        <TabsTrigger value="characters">Characters</TabsTrigger>
        <TabsTrigger value="plot">Plot Ideas</TabsTrigger>
        <TabsTrigger value="custom">Custom</TabsTrigger>
      </TabsList>

      <TabsContent value="continue" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Suggestions to continue your writing</h3>
          <Button variant="ghost" size="sm" onClick={generateSuggestions} disabled={isGenerating}>
            <RefreshCcw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isGenerating ? (
          <div className="space-y-2">
            <div className="h-16 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-16 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-md bg-gray-50 p-3 hover:bg-gray-100"
                onClick={() => onInsertText(` ${suggestion}`)}
              >
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Paraphrase Text</h3>
          <Textarea
            placeholder="Enter text to paraphrase..."
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            className="h-20"
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleParaphraseRequest}
              disabled={!selectedText.trim() || isGenerating}
            >
              <Wand2 className="mr-1 h-3 w-3" />
              Paraphrase
            </Button>
            {paraphrasedText && (
              <Button variant="outline" size="sm" onClick={() => onInsertText(` ${paraphrasedText}`)}>
                Insert
              </Button>
            )}
          </div>
          {paraphrasedText && <div className="rounded-md bg-gray-50 p-2 text-sm text-gray-700">{paraphrasedText}</div>}
        </div>
      </TabsContent>

      <TabsContent value="characters" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Character Suggestions</h3>
          <Button variant="ghost" size="sm" onClick={generateCharacters} disabled={isGenerating}>
            <RefreshCcw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isGenerating ? (
          <div className="space-y-2">
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {characters.map((character, index) => (
              <div key={index} className="rounded-md bg-gray-50 p-3 hover:bg-gray-100">
                <h4 className="font-medium text-gray-800">{character.name}</h4>
                <p className="mt-1 text-sm text-gray-600">{character.description}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => onInsertText(` ${character.name}`)}>
                  Insert Name
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Character Generator</h4>
          <div className="mt-2 flex space-x-2">
            <Input placeholder="Character traits (e.g., 'mysterious professor')" className="text-sm" />
            <Button size="sm">
              <Sparkles className="mr-1 h-3 w-3" />
              Generate
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="plot" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Plot Ideas & Twists</h3>
          <Button variant="ghost" size="sm" onClick={generatePlotIdeas} disabled={isGenerating}>
            <RefreshCcw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isGenerating ? (
          <div className="space-y-2">
            <div className="h-12 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-12 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-12 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {plotIdeas.map((idea, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-md bg-gray-50 p-3 hover:bg-gray-100"
                onClick={() => onInsertText(` ${idea}`)}
              >
                <p className="text-gray-700">{idea}</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Plot Element Generator</h4>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              Conflict
            </Button>
            <Button variant="outline" size="sm">
              Resolution
            </Button>
            <Button variant="outline" size="sm">
              Plot Twist
            </Button>
            <Button variant="outline" size="sm">
              Setting
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="custom" className="space-y-4 py-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Custom AI Prompt</h3>
          <Textarea
            placeholder="Ask anything (e.g., 'Create a detailed setting for a coastal town' or 'Help me develop a character motivation')"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="h-24"
          />
          <Button onClick={generateCustomResponse} disabled={!customPrompt.trim() || isGenerating} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Response
          </Button>
        </div>

        {isGenerating ? (
          <div className="h-32 animate-pulse rounded-md bg-gray-200"></div>
        ) : (
          customResponse && (
            <div className="space-y-2">
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-gray-700">{customResponse}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onInsertText(` ${customResponse}`)}>
                Insert Response
              </Button>
            </div>
          )
        )}
      </TabsContent>
    </Tabs>
  )
}
