"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Monitor,
  PenTool,
  Sparkles,
  Lock,
  HardDrive,
  Sliders,
  Info,
  Globe,
  Moon,
  Sun,
  Fingerprint,
  RotateCw,
  RotateCcw,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const updateLanguage = (language: string) => {
  // Save language to local storage
  localStorage.setItem("appLanguage", language);
  document.documentElement.lang = language;
};

const updateTimezone = (timezone: string) => {
  // Mock implementation for timezone adjustment
  console.log(`Timezone set to: ${timezone}`);
  const now = new Date();
  const offset = parseInt(timezone.replace('utc', '')) * 60;
  const adjustedTime = new Date(now.getTime() + offset * 60000);
  console.log(`Adjusted time: ${adjustedTime.toISOString()}`);
};

export default function DeviceSettingsScreen() {
  const router = useRouter()
  const [deviceName, setDeviceName] = useState("Tagore Writer")
  const [autoTime, setAutoTime] = useState(true)
  const [language, setLanguage] = useState("english")
  const [timezone, setTimezone] = useState("utc-8")
  const [refreshRate, setRefreshRate] = useState("auto")
  const [fontFamily, setFontFamily] = useState("serif")
  const [fontSize, setFontSize] = useState("medium")
  const [brightness, setBrightness] = useState(() => {
    const savedBrightness = localStorage.getItem("brightness");
    return savedBrightness ? parseInt(savedBrightness, 10) : 70;
  });
  const [defaultMode, setDefaultMode] = useState("novel")
  const [autosaveInterval, setAutosaveInterval] = useState("30s")
  const [showWordCount, setShowWordCount] = useState(true)
  const [margins, setMargins] = useState("medium")
  const [backupLocation, setBackupLocation] = useState("internal")
  const [grammarChecker, setGrammarChecker] = useState(true)
  const [paraphrasingTools, setParaphrasingTools] = useState(true)
  const [aiCharacterHelper, setAiCharacterHelper] = useState(true)
  const [aiTone, setAiTone] = useState("creative")
  const [summarizationLength, setSummarizationLength] = useState("medium")
  const [autoLock, setAutoLock] = useState(true)
  const [autoLockTime, setAutoLockTime] = useState("5min")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [exportLocation, setExportLocation] = useState("internal")
  const [cloudSync, setCloudSync] = useState(false)
  const [knobDirection, setKnobDirection] = useState("clockwise")
  const [keyboardLayout, setKeyboardLayout] = useState("qwerty")
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState(["Network1", "Network2", "Network3"]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Load language from local storage on mount
    const savedLanguage = localStorage.getItem("appLanguage") || "english";
    setLanguage(savedLanguage);
    updateLanguage(savedLanguage);

    updateTimezone(timezone);
  }, []);

  useEffect(() => {
    updateLanguage(language);
    updateTimezone(timezone);
  }, [language, timezone]);

  useEffect(() => {
    // Adjust brightness by setting a CSS variable
    document.documentElement.style.setProperty("--brightness", `${brightness}%`);
  }, [brightness]);

  useEffect(() => {
    // Apply font size by setting a CSS variable
    document.documentElement.style.setProperty("--font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    // Load saved brightness from local storage on mount
    const savedBrightness = localStorage.getItem("brightness");
    if (savedBrightness) {
      setBrightness(parseInt(savedBrightness, 10));
    }
  }, []);

  useEffect(() => {
    // Save brightness to local storage whenever it changes
    localStorage.setItem("brightness", brightness.toString());
  }, [brightness]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}, Ctrl: ${event.ctrlKey}`); // Debugging log
      if (event.ctrlKey && event.key.toLowerCase() === 'b') {
        event.preventDefault(); // Prevent default browser behavior
        router.back(); // Navigate back
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  const handleBackNavigation = () => {
    router.back();
  };

  const handleConnect = () => {
    if (selectedNetwork && password) {
      alert(`Connecting to ${selectedNetwork}...`);
      // Simulate connection logic here
    } else {
      alert("Please select a network and enter the password.");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={handleBackNavigation} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-xl font-medium text-gray-800">Device Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-9 md:grid-cols-9">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="wifi">WiFi</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="writing">Writing</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>Configure basic device settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="device-name">Device Name</Label>
                    <Input
                      id="device-name"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="Enter device name"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-time">Auto-sync Date & Time</Label>
                      <p className="text-xs text-gray-500">Automatically sync time with network</p>
                    </div>
                    <Switch id="auto-time" checked={autoTime} onCheckedChange={setAutoTime} />
                  </div>

                  {!autoTime && (
                    <div className="space-y-2">
                      <Label htmlFor="manual-time">Manual Date & Time</Label>
                      <Input id="manual-time" type="datetime-local" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-12">UTC-12:00</SelectItem>
                        <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                        <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                        <SelectItem value="utc+0">UTC+00:00 (GMT)</SelectItem>
                        <SelectItem value="utc+1">UTC+01:00 (CET)</SelectItem>
                        <SelectItem value="utc+8">UTC+08:00 (CST)</SelectItem>
                        <SelectItem value="utc+9">UTC+09:00 (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display Settings */}
            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5" />
                    Display Settings
                  </CardTitle>
                  <CardDescription>Configure screen and visual preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="refresh-rate">E Ink Refresh Rate</Label>
                    <Select value={refreshRate} onValueChange={setRefreshRate}>
                      <SelectTrigger id="refresh-rate">
                        <SelectValue placeholder="Select refresh rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (Smart Refresh)</SelectItem>
                        <SelectItem value="fast">Fast (Partial Refresh)</SelectItem>
                        <SelectItem value="quality">Quality (Full Refresh)</SelectItem>
                        <SelectItem value="custom">Custom (Every 5 Pages)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Type</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Select font type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans-serif">Sans-serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                        <SelectItem value="dyslexic">Dyslexic-friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="x-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brightness">Brightness</Label>
                      <span className="text-sm text-gray-500">{brightness}%</span>
                    </div>
                    <Slider
                      id="brightness"
                      min={0}
                      max={100}
                      step={1}
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Writing Settings */}
            <TabsContent value="writing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="mr-2 h-5 w-5" />
                    Writing Settings
                  </CardTitle>
                  <CardDescription>Configure writing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-mode">Default Mode on Boot</Label>
                    <Select value={defaultMode} onValueChange={setDefaultMode}>
                      <SelectTrigger id="default-mode">
                        <SelectValue placeholder="Select default mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novel">Novel Mode</SelectItem>
                        <SelectItem value="note">Note Mode</SelectItem>
                        <SelectItem value="distraction-free">Distraction-Free Mode</SelectItem>
                        <SelectItem value="last-used">Last Used Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="autosave">Autosave Interval</Label>
                    <Select value={autosaveInterval} onValueChange={setAutosaveInterval}>
                      <SelectTrigger id="autosave">
                        <SelectValue placeholder="Select autosave interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15s">Every 15 seconds</SelectItem>
                        <SelectItem value="30s">Every 30 seconds</SelectItem>
                        <SelectItem value="1min">Every minute</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="off">Off (Manual save only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="word-count">Show Word Count</Label>
                      <p className="text-xs text-gray-500">Display word count in the status bar</p>
                    </div>
                    <Switch id="word-count" checked={showWordCount} onCheckedChange={setShowWordCount} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="margins">Page Margins</Label>
                    <Select value={margins} onValueChange={setMargins}>
                      <SelectTrigger id="margins">
                        <SelectValue placeholder="Select page margins" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="narrow">Narrow</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="wide">Wide</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup">Backup Location</Label>
                    <Select value={backupLocation} onValueChange={setBackupLocation}>
                      <SelectTrigger id="backup">
                        <SelectValue placeholder="Select backup location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal Storage</SelectItem>
                        <SelectItem value="sd">SD Card</SelectItem>
                        <SelectItem value="usb">USB Drive (when connected)</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI & Assistance */}
            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI & Assistance
                  </CardTitle>
                  <CardDescription>Configure AI writing tools and assistance features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="grammar-checker">Grammar Checker</Label>
                      <p className="text-xs text-gray-500">Highlight grammar issues while typing</p>
                    </div>
                    <Switch id="grammar-checker" checked={grammarChecker} onCheckedChange={setGrammarChecker} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paraphrasing">Paraphrasing Tools</Label>
                      <p className="text-xs text-gray-500">Enable text rewriting suggestions</p>
                    </div>
                    <Switch id="paraphrasing" checked={paraphrasingTools} onCheckedChange={setParaphrasingTools} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ai-character">AI Character/Plot Helper</Label>
                      <p className="text-xs text-gray-500">Enable AI-powered creative writing assistance</p>
                    </div>
                    <Switch id="ai-character" checked={aiCharacterHelper} onCheckedChange={setAiCharacterHelper} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-tone">AI Tone</Label>
                    <Select value={aiTone} onValueChange={setAiTone}>
                      <SelectTrigger id="ai-tone">
                        <SelectValue placeholder="Select AI tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summarization">Summarization Length</Label>
                    <Select value={summarizationLength} onValueChange={setSummarizationLength}>
                      <SelectTrigger id="summarization">
                        <SelectValue placeholder="Select summarization length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (1 paragraph)</SelectItem>
                        <SelectItem value="medium">Medium (2-3 paragraphs)</SelectItem>
                        <SelectItem value="long">Long (4+ paragraphs)</SelectItem>
                        <SelectItem value="bullet">Bullet Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>Configure security and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Change PIN
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Fingerprint className="h-4 w-4" />
                        <Label>Fingerprint Authentication</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-lock">Session Auto-Lock</Label>
                      <p className="text-xs text-gray-500">Lock device after period of inactivity</p>
                    </div>
                    <Switch id="auto-lock" checked={autoLock} onCheckedChange={setAutoLock} />
                  </div>

                  {autoLock && (
                    <div className="space-y-2">
                      <Label htmlFor="auto-lock-time">Auto-Lock After</Label>
                      <Select value={autoLockTime} onValueChange={setAutoLockTime}>
                        <SelectTrigger id="auto-lock-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1min">1 minute</SelectItem>
                          <SelectItem value="5min">5 minutes</SelectItem>
                          <SelectItem value="15min">15 minutes</SelectItem>
                          <SelectItem value="30min">30 minutes</SelectItem>
                          <SelectItem value="1hour">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Export & Storage */}
            <TabsContent value="storage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="mr-2 h-5 w-5" />
                    Export & Storage
                  </CardTitle>
                  <CardDescription>Configure export preferences and manage storage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Default Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="epub">ePub (eBook)</SelectItem>
                        <SelectItem value="docx">Word Document</SelectItem>
                        <SelectItem value="txt">Plain Text</SelectItem>
                        <SelectItem value="md">Markdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-location">Export Location</Label>
                    <Select value={exportLocation} onValueChange={setExportLocation}>
                      <SelectTrigger id="export-location">
                        <SelectValue placeholder="Select export location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal Storage</SelectItem>
                        <SelectItem value="sd">SD Card</SelectItem>
                        <SelectItem value="usb">USB Drive (when connected)</SelectItem>
                        <SelectItem value="cloud">Cloud Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Storage Usage</Label>
                    <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-3/4 bg-gray-700"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Used: 6.2 GB</span>
                      <span>Available: 1.8 GB</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cloud-sync">Cloud Sync</Label>
                      <p className="text-xs text-gray-500">Automatically sync files to cloud storage</p>
                    </div>
                    <Switch id="cloud-sync" checked={cloudSync} onCheckedChange={setCloudSync} />
                  </div>

                  <Button variant="outline" className="w-full">
                    Manage Storage
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Device Controls */}
            <TabsContent value="controls" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sliders className="mr-2 h-5 w-5" />
                    Device Controls
                  </CardTitle>
                  <CardDescription>Configure hardware controls and system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="knob-direction">Knob Direction</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="clockwise"
                          name="knob-direction"
                          checked={knobDirection === "clockwise"}
                          onChange={() => setKnobDirection("clockwise")}
                        />
                        <Label htmlFor="clockwise" className="flex items-center">
                          <RotateCw className="mr-1 h-4 w-4" /> Clockwise = Next
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="counter-clockwise"
                          name="knob-direction"
                          checked={knobDirection === "counter-clockwise"}
                          onChange={() => setKnobDirection("counter-clockwise")}
                        />
                        <Label htmlFor="counter-clockwise" className="flex items-center">
                          <RotateCcw className="mr-1 h-4 w-4" /> Counter-clockwise = Next
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keyboard-layout">Keyboard Layout</Label>
                    <Select value={keyboardLayout} onValueChange={setKeyboardLayout}>
                      <SelectTrigger id="keyboard-layout">
                        <SelectValue placeholder="Select keyboard layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qwerty">QWERTY</SelectItem>
                        <SelectItem value="azerty">AZERTY</SelectItem>
                        <SelectItem value="qwertz">QWERTZ</SelectItem>
                        <SelectItem value="dvorak">Dvorak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Check for System Updates
                    </Button>

                    <Button variant="outline" className="w-full text-gray-700">
                      Factory Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WiFi Settings */}
            <TabsContent value="wifi" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5" />
                    WiFi Settings
                  </CardTitle>
                  <CardDescription>Configure WiFi connectivity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="wifi-enabled">Enable WiFi</Label>
                    </div>
                    <Switch id="wifi-enabled" checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
                  </div>

                  {wifiEnabled && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-1">
                          Available Networks
                        </Label>
                        <Select
                          id="network"
                          value={selectedNetwork}
                          onValueChange={setSelectedNetwork}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a network" />
                          </SelectTrigger>
                          <SelectContent>
                            {wifiNetworks.map((network, index) => (
                              <SelectItem key={index} value={network}>
                                {network}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter network password"
                        />
                      </div>

                      <Button
                        onClick={handleConnect}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* About */}
            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    About Device
                  </CardTitle>
                  <CardDescription>View device information and credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Device Model</span>
                      <span className="text-sm text-gray-700">Tagore Writer Pro</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">OS Version</span>
                      <span className="text-sm text-gray-700">Sonzaikan OS 1.2.4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Serial Number</span>
                      <span className="text-sm text-gray-700">TGR-2023-78542169</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Build Number</span>
                      <span className="text-sm text-gray-700">20230915-1842</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Hardware Version</span>
                      <span className="text-sm text-gray-700">Rev. B</span>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Developer Credits</h3>
                    <p className="text-xs text-gray-600">
                      Sonzaikan OS was developed by the Tagore Project team, with contributions from the open-source
                      community.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Open Source Licenses</h3>
                    <Button variant="outline" size="sm" className="w-full">
                      View Licenses
                    </Button>
                  </div>

                  <div className="mt-4 text-center text-xs text-gray-500">
                    <p>© 2023 Tagore Project. All rights reserved.</p>
                    <p className="mt-1">Made with ♥ for writers and thinkers.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
