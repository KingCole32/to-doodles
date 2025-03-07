"use server"

import { Doodle } from '@/types/Doodle'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { StoreEnum } from '@/types/Store'

const baseUrl = "http://localhost:3032/doodles"
const baseHeader: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json"
}

export const getDoodles = async (page: string, offset: string, status: string, tags?: string): Promise<Array<Doodle>> => {
  const user = await getCurrentUser()
  if (!user) {
    console.error(new Error("Retrieving doodle failed, missing user data"))
    return []
  }
  const url = `${baseUrl}/get/${user.id}/${page}/${offset}/${status}${tags ? `/${tags}` : ""}`

  const res = await fetch(
    url,
    {method: "GET", headers: baseHeader}
  )
  const resJSON = await res.json()
  console.warn("get doodle res: ", (resJSON as Array<Doodle>).length)

  return resJSON
}

export const getTotalNumDoodles = async (status: string, tags?: string): Promise<number> => {
  const user = await getCurrentUser()
  if (!user) {
    console.error(new Error("Retrieving doodle failed, missing user data"))
    return 0
  }

  const url = `${baseUrl}/count/${user.id}/${status}${tags ? `/${tags}` : ""}`

  const res = await fetch(
    url,
    {method: "GET", headers: baseHeader}
  )
  const resJSON = await res.json()
  console.warn("count doods: ", resJSON)

  return resJSON
}

export const updateDoodle = async (doodleId: number, title: string,  content: string, deadline: string, tags?: string) => {
  const url = `${baseUrl}/update`
  const body = JSON.stringify({
    doodleId: doodleId,
    title: title,
    body: content,
    deadline: new Date(deadline).toLocaleDateString("ja"),
    tags: tags
  })

  const res = await fetch(
    url,
    { method: "PUT", headers: baseHeader, body: body }
  )

  const resJSON = await res.json()

  console.log("update doodle res: ", resJSON)
  if (resJSON) {
    const refreshUrl = (await cookies()).get(StoreEnum.refreshUrl)
    const redirectUrl = refreshUrl ? refreshUrl ?.value : "/"
    redirect(redirectUrl)
  }
}

export const createDoodle = async (title: string, content: string, deadline: string, tags?: string) => {
  const user = await getCurrentUser()
  if (!user) return new Error("Creating doodle failed, missing user data")
    console.warn("creating dood: ", tags)
  const url = `${baseUrl}/create`
  const body = JSON.stringify({ title: title, body: content, deadline: deadline, userId: user.id, tags: tags })

  const res = await fetch(
    url,
    { method: "PUT", headers: baseHeader, body: body }
  )

  const resJSON = await res.json()

  console.log("create doodle res: ", resJSON)
  if (resJSON) {
    const refreshUrl = (await cookies()).get(StoreEnum.refreshUrl)
    const redirectUrl = refreshUrl ? refreshUrl ?.value : "/"
    redirect(redirectUrl)
  }
}

export const deleteDoodle = async (doodleId: number) => {
  // const url = `${baseUrl}/delete/${doodleId}`
  const url = `${baseUrl}/delete`
  const body = JSON.stringify({ doodleId: doodleId })

  const res = await fetch(
    url,
    { method: "DELETE", headers: baseHeader, body: body }
  )

  const resJSON = await res.json()
  console.warn("delete res: ", resJSON)

  if (resJSON) {
    const cookieStore = await cookies()
    const refreshUrl = cookieStore.get(StoreEnum.refreshUrl)?.value
    redirect(refreshUrl ? refreshUrl : "/")
  }
}

// /change_status/:doodleId/:newStatus
export const changeDoodleStatus = async (doodleId: number, newStatus: number) => {
  // const url = `${baseUrl}/change_status/${doodleId}/${newStatus}`
  const url = `${baseUrl}/change_status`
  const body = JSON.stringify({ doodleId: doodleId, newStatus: newStatus })

  const res = await fetch(
    url,
    { method: "PUT", headers: baseHeader, body: body }
  )

  const resJSON = await res.json()

  console.warn("change status res: ", resJSON)
  return resJSON
}
