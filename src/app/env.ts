const env = {
    appwrite: {
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
        projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT),
        apiKey: String(process.env.NEXT_APPWRITE_KEY)
    }
}

export default env;