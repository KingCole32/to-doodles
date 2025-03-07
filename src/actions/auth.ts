"use server"

import { StoreEnum } from '@/types/Store'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const baseUrl = "http://localhost:3032"
const baseHeader: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json"
}

export const login = async (email: string, password: string): Promise<any | Error> => {
  const url = `${baseUrl}/auth/login`
  const header: HeadersInit = {
    Accept: 'application/json',
    authorization: "Basic " + Buffer.from(`${email}:${password}`).toString('base64')
  }
  const res = await fetch(
    url,
    {method: "GET", headers: header, cache: 'no-cache'}
  )
  const resJson = await res.json()

  console.warn("login res: ", res)

  if (resJson && resJson.length > 0) {
    const userResult = resJson[0] as DoodleUser

    const cookieStore = await cookies();
    // create user cookie with a lifespan of 24h
    cookieStore.set(StoreEnum.user, JSON.stringify(userResult), {maxAge: 86400})
    return userResult
  } else return new Error("User not found")
}

export const signup = async (name: string, email: string, pass: string): Promise<DoodleUser | Error> => {
  const url = `${baseUrl}/auth/signup`
  const body = JSON.stringify({ name: name, email: email, pass: pass })

  const res = await fetch(url, {method: "PUT", headers: baseHeader, body: body})
  const resultId = await res.json()

  // also create user cookie on successful signup, since we already know their info, then
  if (resultId != undefined) {
    const cookieStore = await cookies()
    const newUser: DoodleUser = { id: resultId, userName: name, email: email }
    cookieStore.set(StoreEnum.user, JSON.stringify(newUser), {maxAge: 86400})
    return newUser
  } else return new Error("Signup failed")
}

export const logout = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(StoreEnum.user)
  redirect('/signin')
}

export const getCurrentUser = async (): Promise<DoodleUser | undefined> => {
  const userToReturn = (await cookies()).get("user")
  if (userToReturn) return JSON.parse(userToReturn.value) as DoodleUser
  else return undefined
}