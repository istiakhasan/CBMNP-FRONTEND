'use server'

import webpush from 'web-push'
import type { PushSubscription as WPSubscription } from 'web-push'

webpush.setVapidDetails(
  'mailto:istieak.hasan1996@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: WPSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  const wpSub: WPSubscription = JSON.parse(JSON.stringify(sub))
  subscription = wpSub
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) throw new Error('No subscription available')

  try {
    await webpush.sendNotification(subscription, JSON.stringify({
      title: 'Test Notification',
      body: message,
      icon: '/icon.png',
    }))
    return { success: true }
  } catch (error) {
    console.error('Push error:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
