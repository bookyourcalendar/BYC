"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { default as Dashboard } from "./(main)/Dashboard/page"

export default function Home() {
  const router = useRouter()
  
  // Redirect to the Dashboard page with proper layout
  useEffect(() => {
    router.push("/Dashboard")
  }, [router])
  
  // Return the Dashboard component as a fallback
  return <Dashboard />
}
