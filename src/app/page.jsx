import Dashboard from "./Dashboard/page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  return <Dashboard />; 
}
