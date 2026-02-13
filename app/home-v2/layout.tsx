import React from "react"
import type { Metadata } from 'next'
import './home-v2.css'

export const metadata: Metadata = {
  title: 'Saubh.Tech - Phygital Gig-Work Marketplace',
  description: 'Discover and connect with trusted, verified professionals across India\'s fastest-growing sectors. Community-verified phygital gig-work marketplace combining physical trust with digital scalability.',
}

export default function HomeV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
