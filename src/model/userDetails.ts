export type UserDetails = {
    firstName: string,
    lastName: number,
    emailId: string,
    password: string,
    lastUpdatedAt: string
}

export type LoginDetails = {
    emailId: string,
    password: string
}

export type NewUserDetailsRequest = {
    firstName?: string,
    lastName?: number,
    password?: string,
}