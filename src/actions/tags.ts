"use server"

import { Doodle, DoodleTag } from '@/types/Doodle'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { StoreEnum } from '@/types/Store'

const baseUrl = "http://localhost:3032/tags"
const baseHeader: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json"
}

export const getTags = async (): Promise<Array<DoodleTag>> => {
  const user = await getCurrentUser()
  if (!user) {
    console.error(new Error("Retrieving doodle failed, missing user data"))
    return []
  }
  const url = `${baseUrl}/get/${user.id}`

  const res = await fetch(
    url,
    {method: "GET", headers: baseHeader}
  )
  const resJSON = await res.json()
  console.warn("get tags res: ", (resJSON as Array<Doodle>).length)

  return resJSON
}

export const createTag = async (name: string) => {
  const user = await getCurrentUser()
  if (!user) return new Error("Creating doodle failed, missing user data")

  const url = `${baseUrl}/create`
  const body = JSON.stringify({ userId: user.id, name: name})

  const res = await fetch(
    url,
    { method: "PUT", headers: baseHeader, body: body }
  )

  const resJSON = await res.json()

  console.log("create tag res: ", resJSON)
  if (resJSON) {
    const cookieStore = await cookies()
    const refreshUrl = cookieStore.get(StoreEnum.refreshUrl)?.value
    redirect(refreshUrl ? refreshUrl : "/")
  }
}

export const updateTag = async (tagId: number, name: string) => {
  const url = `${baseUrl}/update`
  const body = JSON.stringify({ tagId: tagId, name: name})

  const res = await fetch(
    url,
    { method: "PUT", headers: baseHeader, body: body }
  )

  const resJSON = await res.json()

  console.log("update tag res: ", resJSON)
  return resJSON
}

export const deleteTag = async (tagId: number) => {
  const url = `${baseUrl}/delete`
  const body = JSON.stringify({ tagId: tagId })

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
