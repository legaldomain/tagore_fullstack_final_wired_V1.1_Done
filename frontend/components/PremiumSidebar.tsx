import { Pencil, User, FileText, RefreshCcw, Lock } from "lucide-react"

export default function PremiumSidebar() {
  return (
    <aside className="w-72 min-w-[18rem] border-l border-gray-200 bg-gray-50 p-4 flex flex-col gap-4 h-full">
      <h2 className="font-serif text-lg font-semibold text-gray-800 mb-2">Premium Features</h2>
      <div className="text-xs text-gray-500 mb-2">Writing & Organization</div>
      <div className="text-xs text-gray-700 font-semibold mb-2">AI Assistance</div>
      <div className="flex flex-col gap-3">
        {/* Writing Suggestions */}
        <div className="rounded-lg bg-white border border-gray-200 p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-gray-800 text-sm">Writing Suggestions</span>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
              Premium <Lock className="h-3 w-3 inline" />
            </span>
          </div>
          <div className="text-xs text-gray-600">Get AI-powered suggestions to continue your writing.</div>
        </div>
        {/* Character Development */}
        <div className="rounded-lg bg-white border border-gray-200 p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-700" />
            <span className="font-medium text-gray-800 text-sm">Character Development</span>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
              Premium <Lock className="h-3 w-3 inline" />
            </span>
          </div>
          <div className="text-xs text-gray-600">Generate character profiles, names, and backstories.</div>
        </div>
        {/* Plot Ideas */}
        <div className="rounded-lg bg-white border border-gray-200 p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-700" />
            <span className="font-medium text-gray-800 text-sm">Plot Ideas</span>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
              Premium <Lock className="h-3 w-3 inline" />
            </span>
          </div>
          <div className="text-xs text-gray-600">Get suggestions for plot twists, conflicts, and resolutions.</div>
        </div>
        {/* Paraphrasing Tool */}
        <div className="rounded-lg bg-white border border-yellow-200 p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-gray-800 text-sm">Paraphrasing Tool</span>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
              New <span className="ml-1">Premium</span> <Lock className="h-3 w-3 inline" />
            </span>
          </div>
          <div className="text-xs text-gray-600">Rewrite sentences or paragraphs with different wording.</div>
        </div>
      </div>
    </aside>
  )
} 