"use client"

import * as React from "react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  welcomeMessage?: string
  prompt?: string
  initialCommands?: string[]
  onCommand?: (command: string) => Promise<string> | string
}

const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  ({
    className,
    welcomeMessage = "Welcome to the terminal. Type 'help' to see available commands.",
    prompt = ">",
    initialCommands = [],
    onCommand,
    ...props
  }, ref) => {
    const [history, setHistory] = useState<{ type: 'input' | 'output', content: string }[]>([])
    const [input, setInput] = useState('')
    const [commandIndex, setCommandIndex] = useState(-1)
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const terminalRef = useRef<HTMLDivElement>(null)

    const executeCommand = async (cmd: string) => {
      setHistory(prev => [...prev, { type: 'input', content: cmd }])
      
      let output = 'Command not recognized. Type "help" for available commands.'
      
      if (cmd === 'help') {
        output = `
Available commands:
- help: Show this help message
- clear: Clear the terminal
- echo [text]: Echo text back to the terminal
        `.trim()
      } else if (cmd === 'clear') {
        setHistory([])
        return
      } else if (cmd.startsWith('echo ')) {
        output = cmd.substring(5)
      } else if (onCommand) {
        try {
          const result = await onCommand(cmd)
          output = result
        } catch (error) {
          output = `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      }
      
      setHistory(prev => [...prev, { type: 'output', content: output }])
      setCommandHistory(prev => [cmd, ...prev])
      setCommandIndex(-1)
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (input.trim()) {
        executeCommand(input.trim())
        setInput('')
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const nextIndex = Math.min(commandIndex + 1, commandHistory.length - 1)
        setCommandIndex(nextIndex)
        if (commandHistory[nextIndex]) {
          setInput(commandHistory[nextIndex])
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextIndex = Math.max(commandIndex - 1, -1)
        setCommandIndex(nextIndex)
        if (nextIndex === -1) {
          setInput('')
        } else if (commandHistory[nextIndex]) {
          setInput(commandHistory[nextIndex])
        }
      }
    }

    useEffect(() => {
      // Add welcome message
      setHistory([{ type: 'output', content: welcomeMessage }])
      
      // Execute initial commands
      if (initialCommands.length > 0) {
        initialCommands.forEach(cmd => {
          executeCommand(cmd)
        })
      }
    }, [welcomeMessage, initialCommands, executeCommand])

    useEffect(() => {
      inputRef.current?.focus()
      
      // Scroll terminal to bottom
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, [history])

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-80 bg-black text-green-500 p-4 font-mono text-sm rounded-md overflow-hidden flex flex-col",
          className
        )}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto pb-2 whitespace-pre-wrap"
        >
          {history.map((item, index) => (
            <div key={index} className={cn(
              "mb-1",
              item.type === 'input' && "text-green-400"
            )}>
              {item.type === 'input' ? `${prompt} ${item.content}` : item.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="mr-2">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400"
            autoFocus
            aria-label="Terminal input"
          />
        </form>
      </div>
    )
  }
)

Terminal.displayName = "Terminal"

export { Terminal } 