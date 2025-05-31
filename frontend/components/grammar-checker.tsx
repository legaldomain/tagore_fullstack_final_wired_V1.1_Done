"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Check, RefreshCcw, BarChart2, Zap } from "lucide-react"

interface GrammarCheckerProps {
  text: string
  onApplyFix: (fixedText: string) => void
}

interface GrammarIssue {
  type: "grammar" | "style" | "clarity"
  severity: "low" | "medium" | "high"
  original: string
  suggestion: string
  explanation: string
  startIndex: number
  endIndex: number
}

export default function GrammarChecker({ text, onApplyFix }: GrammarCheckerProps) {
  const [issues, setIssues] = useState<GrammarIssue[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [stats, setStats] = useState({
    readability: "Good",
    readingTime: "2 min",
    passiveVoice: "12%",
    wordVariety: "High",
    sentenceLength: "Medium",
  })
  const [fixedText, setFixedText] = useState(text)

  // Mock grammar check on component mount
  useEffect(() => {
    checkGrammar()
  }, [])

  const checkGrammar = () => {
    setIsChecking(true)

    // Simulate grammar check delay
    setTimeout(() => {
      // Mock grammar issues
      setIssues([
        {
          type: "grammar",
          severity: "high",
          original: "It was raining again.",
          suggestion: "It was raining again,",
          explanation: "Consider adding a comma to connect the two related clauses.",
          startIndex: 0,
          endIndex: 19,
        },
        {
          type: "style",
          severity: "medium",
          original: "reminded him of",
          suggestion: "evoked memories of",
          explanation: "Consider a more evocative verb to strengthen the imagery.",
          startIndex: 20,
          endIndex: 34,
        },
        {
          type: "clarity",
          severity: "low",
          original: "...",
          suggestion: "distant echoes from his past.",
          explanation: "Replace ellipsis with a more descriptive ending to engage readers.",
          startIndex: 34,
          endIndex: 37,
        },
      ])

      setFixedText("It was raining again, the sound evoked memories of distant echoes from his past.")

      setIsChecking(false)
    }, 1000)
  }

  const applySingleFix = (issue: GrammarIssue) => {
    const newText = text.substring(0, issue.startIndex) + issue.suggestion + text.substring(issue.endIndex)
    setFixedText(newText)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-gray-700"
      case "medium":
        return "text-gray-600"
      case "low":
        return "text-gray-500"
      default:
        return "text-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "grammar":
        return <AlertTriangle className="h-4 w-4" />
      case "style":
        return <BarChart2 className="h-4 w-4" />
      case "clarity":
        return <Zap className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Tabs defaultValue="issues">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="stats">Style Stats</TabsTrigger>
      </TabsList>

      <TabsContent value="issues" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Grammar & Style Issues</h3>
          <Button variant="ghost" size="sm" onClick={checkGrammar} disabled={isChecking}>
            <RefreshCcw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isChecking ? (
          <div className="space-y-2">
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        ) : issues.length > 0 ? (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`rounded-md border-l-2 bg-gray-50 p-3 ${
                  issue.severity === "high"
                    ? "border-gray-700"
                    : issue.severity === "medium"
                      ? "border-gray-500"
                      : "border-gray-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getTypeIcon(issue.type)}
                    <span className={`ml-2 font-medium capitalize ${getSeverityColor(issue.severity)}`}>
                      {issue.type}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => applySingleFix(issue)}>
                    Apply
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="line-through">{issue.original}</span>
                    {" → "}
                    <span className="font-medium text-gray-800">{issue.suggestion}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{issue.explanation}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 rounded-md bg-gray-100 p-3">
              <h4 className="text-sm font-medium text-gray-700">Preview with all fixes applied:</h4>
              <p className="mt-2 text-gray-800">{fixedText}</p>
              <Button className="mt-3 w-full" onClick={() => onApplyFix(fixedText)}>
                <Check className="mr-2 h-4 w-4" />
                Apply All Fixes
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <Check className="mx-auto h-6 w-6 text-gray-500" />
            <p className="mt-2 text-gray-600">No issues found in your text.</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="stats" className="space-y-4 py-4">
        <h3 className="text-sm font-medium text-gray-700">Writing Style Analysis</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
            <span className="text-sm text-gray-600">Readability</span>
            <span className="font-medium text-gray-800">{stats.readability}</span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
            <span className="text-sm text-gray-600">Estimated Reading Time</span>
            <span className="font-medium text-gray-800">{stats.readingTime}</span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
            <span className="text-sm text-gray-600">Passive Voice</span>
            <span className="font-medium text-gray-800">{stats.passiveVoice}</span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
            <span className="text-sm text-gray-600">Word Variety</span>
            <span className="font-medium text-gray-800">{stats.wordVariety}</span>
          </div>

          <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
            <span className="text-sm text-gray-600">Average Sentence Length</span>
            <span className="font-medium text-gray-800">{stats.sentenceLength}</span>
          </div>
        </div>

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Style Suggestions</h4>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
            <li>Consider varying sentence length for better rhythm</li>
            <li>Your vocabulary diversity is good, maintaining reader interest</li>
            <li>The text has a consistent tone appropriate for fiction</li>
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  )
}
