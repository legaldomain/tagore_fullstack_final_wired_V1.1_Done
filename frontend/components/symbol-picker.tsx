"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface SymbolPickerProps {
  onSelectSymbol: (symbol: string) => void
}

export default function SymbolPicker({ onSelectSymbol }: SymbolPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [recentSymbols, setRecentSymbols] = useState<string[]>(["π", "Δ", "λ", "∑", "H₂O", "E=mc²"])

  const greekLetters = [
    "α",
    "β",
    "γ",
    "δ",
    "ε",
    "ζ",
    "η",
    "θ",
    "ι",
    "κ",
    "λ",
    "μ",
    "ν",
    "ξ",
    "ο",
    "π",
    "ρ",
    "σ",
    "τ",
    "υ",
    "φ",
    "χ",
    "ψ",
    "ω",
    "Α",
    "Β",
    "Γ",
    "Δ",
    "Ε",
    "Ζ",
    "Η",
    "Θ",
    "Ι",
    "Κ",
    "Λ",
    "Μ",
    "Ν",
    "Ξ",
    "Ο",
    "Π",
    "Ρ",
    "Σ",
    "Τ",
    "Υ",
    "Φ",
    "Χ",
    "Ψ",
    "Ω",
  ]

  const mathSymbols = [
    "∑",
    "∏",
    "∫",
    "∂",
    "∇",
    "∆",
    "√",
    "∛",
    "∜",
    "≈",
    "≠",
    "≡",
    "≤",
    "≥",
    "∈",
    "∉",
    "⊂",
    "⊃",
    "∩",
    "∪",
    "→",
    "←",
    "↔",
    "⇒",
    "⇐",
    "⇔",
    "∞",
    "∝",
    "±",
    "∓",
    "×",
    "÷",
    "⋅",
    "∠",
    "⊥",
    "∥",
    "≅",
    "≃",
    "≢",
    "∀",
    "∃",
    "∄",
    "∴",
    "∵",
  ]

  const subscriptSuperscript = [
    "₀",
    "₁",
    "₂",
    "₃",
    "₄",
    "₅",
    "₆",
    "₇",
    "₈",
    "₉",
    "₊",
    "₋",
    "₌",
    "₍",
    "₎",
    "⁰",
    "¹",
    "²",
    "³",
    "⁴",
    "⁵",
    "⁶",
    "⁷",
    "⁸",
    "⁹",
    "⁺",
    "⁻",
    "⁼",
    "⁽",
    "⁾",
  ]

  const commonFormulas = [
    "E=mc²",
    "F=ma",
    "a²+b²=c²",
    "PV=nRT",
    "F=G(m₁m₂)/r²",
    "E=hν",
    "ΔS≥0",
    "H₂O",
    "CO₂",
    "λ=h/p",
    "∮E·dl = -dΦᵦ/dt",
    "∇×E = -∂B/∂t",
    "∇·B = 0",
    "∇×B = μ₀J + μ₀ε₀∂E/∂t",
  ]

  const physicsSymbols = [
    "Ω",
    "μ",
    "ε",
    "ρ",
    "σ",
    "τ",
    "ν",
    "ω",
    "γ",
    "λ",
    "θ",
    "Φ",
    "Ψ",
    "Δ",
    "∇",
    "∂",
    "∫",
    "∑",
    "∏",
    "∞",
  ]

  const handleSymbolClick = (symbol: string) => {
    onSelectSymbol(symbol)

    // Add to recent symbols if not already there
    if (!recentSymbols.includes(symbol)) {
      const newRecent = [symbol, ...recentSymbols.slice(0, 5)]
      setRecentSymbols(newRecent)
    }
  }

  const filteredSymbols = (symbols: string[]) => {
    if (!searchTerm) return symbols
    return symbols.filter((symbol) => symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search symbols..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />

      <Tabs defaultValue={searchTerm ? "all" : "recent"}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="greek">Greek</TabsTrigger>
          <TabsTrigger value="math">Math</TabsTrigger>
          <TabsTrigger value="sub-sup">Sub/Super</TabsTrigger>
          <TabsTrigger value="physics">Physics</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-4">
          <div className="grid grid-cols-6 gap-1">
            {recentSymbols.map((symbol, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-10 w-full p-0 font-serif text-base"
                onClick={() => handleSymbolClick(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="greek" className="mt-4">
          <div className="grid grid-cols-8 gap-1">
            {filteredSymbols(greekLetters).map((symbol, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 font-serif text-base"
                onClick={() => handleSymbolClick(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="math" className="mt-4">
          <div className="grid grid-cols-8 gap-1">
            {filteredSymbols(mathSymbols).map((symbol, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 font-serif text-base"
                onClick={() => handleSymbolClick(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sub-sup" className="mt-4">
          <div className="grid grid-cols-8 gap-1">
            {filteredSymbols(subscriptSuperscript).map((symbol, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 font-serif text-base"
                onClick={() => handleSymbolClick(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="physics" className="mt-4">
          <div className="grid grid-cols-8 gap-1">
            {filteredSymbols(physicsSymbols).map((symbol, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 font-serif text-base"
                onClick={() => handleSymbolClick(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formulas" className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {filteredSymbols(commonFormulas).map((formula, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 justify-start px-2 font-serif text-sm"
                onClick={() => handleSymbolClick(formula)}
              >
                {formula}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 rounded-md bg-gray-100 p-3">
        <h4 className="text-xs font-medium text-gray-700">Common Combinations</h4>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSymbolClick("x²")}>
            x²
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSymbolClick("x₁")}>
            x₁
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSymbolClick("Δx")}>
            Δx
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSymbolClick("∂f/∂x")}>
            ∂f/∂x
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSymbolClick("∫f(x)dx")}>
            ∫f(x)dx
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSymbolClick("x̄")}>
            x̄ (mean)
          </Button>
        </div>
      </div>
    </div>
  )
}
