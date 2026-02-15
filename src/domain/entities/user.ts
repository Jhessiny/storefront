export type User = {
  id: string
  email: string
  createdAt: string
}

export type Session = {
  user: User
  accessToken: string
}
