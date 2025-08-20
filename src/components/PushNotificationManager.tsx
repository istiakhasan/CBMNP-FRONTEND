'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '../app/actions'

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64Safe)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export default function PushNotificationManager() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async reg => {
        const sub = await reg.pushManager.getSubscription()
        setSubscription(sub)
      })
    }
  }, [])

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    })
    setSubscription(sub)
    await subscribeUser(JSON.parse(JSON.stringify(sub)))
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    if (subscription) await sendNotification(message)
    setMessage('')
  }

  return (
    <div>
      {subscription ? (
        <>
          <p>Subscribed!</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message"/>
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <button onClick={subscribeToPush}>Subscribe to Push</button>
      )}
    </div>
  )
}
