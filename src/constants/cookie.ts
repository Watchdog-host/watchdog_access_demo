import { Cookies } from 'react-cookie'
import { serialize, parse } from 'cookie'
import { ServerResponse, IncomingMessage } from 'http'

export const TOKEN_NAME = 'token'
export const MAX_AGE = 60 * 60 * 8 // 8 hours

export const setTokenCookieAsync = (token: string, res?: ServerResponse) =>
  new Promise((resolve, reject) => {
    try {
      const options: any = {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        path: '/',
        sameSite: 'lax',
      }

      // for client-side
      if (!res) {
        const cookies = new Cookies()
        cookies.set(TOKEN_NAME, token, options)
        return resolve(token)
      }

      // for server-side
      const cookie = serialize(TOKEN_NAME, token, options)
      res.setHeader('Set-Cookie', cookie)
      return resolve(cookie)
    } catch (error) {
      reject(error)
    }
  })

export const setTokenCookie = (token: string, res?: ServerResponse) => {
  const options: any = {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    path: '/',
    sameSite: 'lax',
  }

  // for client-side
  if (!res) {
    const cookies = new Cookies()
    cookies.set(TOKEN_NAME, token, options)
    return
  }

  // for server-side
  const cookie = serialize(TOKEN_NAME, token, options)
  res.setHeader('Set-Cookie', cookie)
}

export const removeTokenCookie = (res?: ServerResponse) => {
  // for client-side
  if (!res) {
    const options: any = {
      maxAge: MAX_AGE,
      expires: new Date(Date.now() + MAX_AGE * 1000),
      path: '/',
      sameSite: 'lax',
    }

    const cookies = new Cookies()
    cookies.remove(TOKEN_NAME, options)
    return
  }

  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })

  if (res) {
    res?.setHeader('Set-Cookie', cookie)
  }
}

export const parseCookies = (req?: IncomingMessage) => {
  if (!req) {
    // for client-side
    const cookies = new Cookies()
    return cookies.getAll()
  }

  // For API Routes we don't need to parse the cookies.
  // @ts-ignore
  if (req?.cookies) return req.cookies

  if (req?.headers.cookie) {
    // For pages we do need to parse the cookies.
    const cookie = req?.headers?.cookie
    return parse(cookie || '')
  }
}

export const getTokenCookie = (req?: IncomingMessage) => {
  const cookies = parseCookies(req)
  return cookies[TOKEN_NAME]
}
