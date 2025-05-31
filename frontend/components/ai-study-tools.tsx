"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Sparkles, RefreshCcw, BookOpen, FileText } from "lucide-react"

interface AIStudyToolsProps {
  currentText: string
  onInsertText: (text: string) => void
}

export default function AIStudyTools({ currentText, onInsertText }: AIStudyToolsProps) {
  const [summary, setSummary] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [structuredNotes, setStructuredNotes] = useState("")
  const [conceptQuery, setConceptQuery] = useState("")
  const [conceptExplanation, setConceptExplanation] = useState("")
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([])

  const generateSummary = () => {
    if (!currentText.trim()) return

    setIsGenerating(true)
    setSummary("")

    // Simulate AI response delay
    setTimeout(() => {
      setSummary(
        "The first law of thermodynamics states that energy cannot be created or destroyed, only transformed from one form to another. This principle of energy conservation is fundamental to understanding how systems exchange energy with their surroundings through heat and work. The mathematical expression ΔU = Q - W represents this law, where ΔU is the change in internal energy, Q is heat added to the system, and W is work done by the system.",
      )
      setIsGenerating(false)
    }, 1500)
  }

  const generateStructuredNotes = () => {
    if (!currentText.trim()) return

    setIsGenerating(true)
    setStructuredNotes("")

    // Simulate AI response delay
    setTimeout(() => {
      setStructuredNotes(
        "# Laws of Thermodynamics\n\n## First Law: Conservation of Energy\n- Energy cannot be created or destroyed\n- Can only be transferred or converted from one form to another\n- Mathematical form: ΔU = Q - W\n\n## Second Law: Entropy\n- The entropy of an isolated system always increases\n- Heat flows spontaneously from hot to cold objects\n- Efficiency of heat engines is limited\n\n## Third Law: Absolute Zero\n- As temperature approaches absolute zero, entropy approaches a constant minimum\n- Perfect crystal at absolute zero has zero entropy",
      )
      setIsGenerating(false)
    }, 1500)
  }

  const generateFlashcards = () => {
    if (!currentText.trim()) return

    setIsGenerating(true)
    setFlashcards([])

    // Simulate AI response delay
    setTimeout(() => {
      setFlashcards([
        {
          question: "What is the First Law of Thermodynamics?",
          answer:
            "Energy cannot be created or destroyed, only transformed from one form to another (conservation of energy).",
        },
        {
          question: "What is the mathematical expression of the First Law?",
          answer:
            "ΔU = Q - W, where ΔU is change in internal energy, Q is heat added, and W is work done by the system.",
        },
        {
          question: "What is the Second Law of Thermodynamics?",
          answer:
            "The entropy of an isolated system always increases; heat flows spontaneously from hot to cold objects.",
        },
        {
          question: "What is the Third Law of Thermodynamics?",
          answer: "As temperature approaches absolute zero, entropy approaches a constant minimum value.",
        },
      ])
      setIsGenerating(false)
    }, 1500)
  }

  const explainConcept = () => {
    if (!conceptQuery.trim()) return

    setIsGenerating(true)
    setConceptExplanation("")

    // Simulate AI response delay
    setTimeout(() => {
      setConceptExplanation(
        conceptQuery.toLowerCase().includes("entropy")
          ? "Entropy is a measure of disorder or randomness in a system. In thermodynamics, it's a state function that describes the unavailability of a system's thermal energy for conversion into mechanical work. The Second Law of Thermodynamics states that the total entropy of an isolated system always increases over time. This explains why heat flows from hot to cold objects, why perfect efficiency is impossible, and why certain processes are irreversible. Mathematically, entropy change is defined as ΔS = Q/T for reversible processes, where Q is heat transferred and T is absolute temperature."
          : conceptQuery.toLowerCase().includes("heat")
            ? "Heat is the transfer of thermal energy between systems due to a temperature difference. Unlike temperature (which is an intensive property), heat is an extensive property measured in joules (J) or calories. Heat transfer occurs through three mechanisms: conduction (direct contact), convection (fluid movement), and radiation (electromagnetic waves). In thermodynamics, heat is represented by Q, with positive Q indicating heat flowing into a system and negative Q indicating heat flowing out of a system."
            : "In thermodynamics, work refers to energy transferred when an external force moves an object through a distance. Work is a process quantity, not a state function, meaning it depends on the path taken. For a gas system, work is often calculated as W = P·ΔV, where P is pressure and ΔV is change in volume. Positive work (W > 0) means the system does work on the surroundings (e.g., gas expanding), while negative work (W < 0) means work is done on the system (e.g., gas being compressed).",
      )
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <Tabs defaultValue="summarize">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="summarize">Summarize</TabsTrigger>
        <TabsTrigger value="structure">Structure</TabsTrigger>
        <TabsTrigger value="explain">Explain</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
      </TabsList>

      <TabsContent value="summarize" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Summarize Your Notes</h3>
          <Button variant="outline" size="sm" onClick={generateSummary} disabled={isGenerating || !currentText.trim()}>
            <RefreshCcw className={`mr-1 h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
            Generate
          </Button>
        </div>

        {isGenerating ? (
          <div className="h-32 animate-pulse rounded-md bg-gray-200"></div>
        ) : summary ? (
          <div className="space-y-2">
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-gray-700">{summary}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onInsertText(`\n\n## Summary\n${summary}`)}>
                Insert Summary
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Generate a concise summary of your current notes to highlight key points.
            </p>
          </div>
        )}

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Summary Options</h4>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              Brief (1 paragraph)
            </Button>
            <Button variant="outline" size="sm">
              Detailed (3 paragraphs)
            </Button>
            <Button variant="outline" size="sm">
              Key Points Only
            </Button>
            <Button variant="outline" size="sm">
              ELI5 (Simplified)
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="structure" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Structure Your Notes</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={generateStructuredNotes}
            disabled={isGenerating || !currentText.trim()}
          >
            <RefreshCcw className={`mr-1 h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
            Generate
          </Button>
        </div>

        {isGenerating ? (
          <div className="h-64 animate-pulse rounded-md bg-gray-200"></div>
        ) : structuredNotes ? (
          <div className="space-y-2">
            <div className="max-h-64 overflow-y-auto rounded-md bg-gray-50 p-3 font-mono text-sm">
              <pre className="whitespace-pre-wrap text-gray-700">{structuredNotes}</pre>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onInsertText(`\n\n${structuredNotes}`)}>
                Insert Structured Notes
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Convert your raw notes into a well-structured format with headings, bullet points, and organization.
            </p>
          </div>
        )}

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Structure Formats</h4>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              Outline Format
            </Button>
            <Button variant="outline" size="sm">
              Cornell Notes
            </Button>
            <Button variant="outline" size="sm">
              Mind Map Text
            </Button>
            <Button variant="outline" size="sm">
              Q&A Format
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="explain" className="space-y-4 py-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Explain a Concept</h3>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter a concept (e.g., 'entropy', 'heat transfer')"
              value={conceptQuery}
              onChange={(e) => setConceptQuery(e.target.value)}
            />
            <Button variant="outline" onClick={explainConcept} disabled={isGenerating || !conceptQuery.trim()}>
              <Sparkles className={`mr-1 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
              Explain
            </Button>
          </div>
        </div>

        {isGenerating ? (
          <div className="h-48 animate-pulse rounded-md bg-gray-200"></div>
        ) : conceptExplanation ? (
          <div className="space-y-2">
            <div className="rounded-md bg-gray-50 p-3">
              <h4 className="font-medium text-gray-800">Explanation: {conceptQuery}</h4>
              <p className="mt-2 text-gray-700">{conceptExplanation}</p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onInsertText(`\n\n## ${conceptQuery}\n${conceptExplanation}`)}
              >
                Insert Explanation
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Get a clear explanation of any concept related to your notes.</p>
          </div>
        )}

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Popular Concepts</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setConceptQuery("Entropy")}>
              Entropy
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConceptQuery("Heat Transfer")}>
              Heat Transfer
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConceptQuery("Work in Thermodynamics")}>
              Work
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConceptQuery("Enthalpy")}>
              Enthalpy
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="flashcards" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Generate Flashcards</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={generateFlashcards}
            disabled={isGenerating || !currentText.trim()}
          >
            <RefreshCcw className={`mr-1 h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
            Generate
          </Button>
        </div>

        {isGenerating ? (
          <div className="space-y-2">
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        ) : flashcards.length > 0 ? (
          <div className="space-y-3">
            {flashcards.map((card, index) => (
              <div key={index} className="rounded-md border border-gray-200 bg-gray-50 p-0">
                <div className="border-b border-gray-200 bg-gray-100 p-3">
                  <p className="font-medium text-gray-800">{card.question}</p>
                </div>
                <div className="p-3">
                  <p className="text-gray-700">{card.answer}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const flashcardText = flashcards.map((card) => `Q: ${card.question}\nA: ${card.answer}\n`).join("\n")
                  onInsertText(`\n\n## Flashcards\n\n${flashcardText}`)
                }}
              >
                Insert All Flashcards
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Generate flashcards from your notes for effective studying.</p>
          </div>
        )}

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Flashcard Options</h4>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              Basic Cards
            </Button>
            <Button variant="outline" size="sm">
              Cloze Deletion
            </Button>
            <Button variant="outline" size="sm">
              Definition Cards
            </Button>
            <Button variant="outline" size="sm">
              Problem-Solution
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
