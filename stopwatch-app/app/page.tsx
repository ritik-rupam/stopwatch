"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Clock } from "lucide-react"

export default function StopwatchApp() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [lapTimes, setLapTimes] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const elapsedTimeRef = useRef<number>(0)

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedTimeRef.current
      setIsRunning(true)

      intervalRef.current = setInterval(() => {
        const currentTime = Date.now() - startTimeRef.current
        setTime(currentTime)
        elapsedTimeRef.current = currentTime
      }, 10)
    }
  }

  const handlePause = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTime(0)
    setIsRunning(false)
    setLapTimes([])
    elapsedTimeRef.current = 0
  }

  const handleLap = () => {
    if (isRunning && time > 0) {
      setLapTimes((prev) => [...prev, time])
    }
  }

  const getBestLap = () => {
    if (lapTimes.length === 0) return null
    return Math.min(...lapTimes)
  }

  const getWorstLap = () => {
    if (lapTimes.length === 0) return null
    return Math.max(...lapTimes)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Stopwatch</h1>
          </div>
          <p className="text-gray-600">Precise time measurement with lap tracking</p>
        </div>

        {/* Main Stopwatch Display */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-gray-900 mb-8 tracking-wider">{formatTime(time)}</div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                {!isRunning ? (
                  <Button onClick={handleStart} size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={handlePause} size="lg" variant="destructive" className="px-8">
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}

                <Button onClick={handleReset} size="lg" variant="outline" className="px-8">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Lap Button */}
              <Button onClick={handleLap} disabled={!isRunning || time === 0} variant="secondary" className="w-full">
                Record Lap
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lap Times */}
        {lapTimes.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Lap Times ({lapTimes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lapTimes.map((lapTime, index) => {
                  const isLast = index === lapTimes.length - 1
                  const isBest = lapTime === getBestLap()
                  const isWorst = lapTime === getWorstLap() && lapTimes.length > 1

                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        isLast ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Lap {lapTimes.length - index}</span>
                        {isBest && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Best
                          </Badge>
                        )}
                        {isWorst && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Worst
                          </Badge>
                        )}
                      </div>
                      <span className="font-mono font-semibold text-lg">{formatTime(lapTime)}</span>
                    </div>
                  )
                })}
              </div>

              {/* Lap Statistics */}
              {lapTimes.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Best Lap</p>
                      <p className="font-mono font-semibold text-green-600">{formatTime(getBestLap()!)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Worst Lap</p>
                      <p className="font-mono font-semibold text-red-600">{formatTime(getWorstLap()!)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
