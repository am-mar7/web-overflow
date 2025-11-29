const ROUTES = {
    HOME : "/",
    SIGN_IN : "/sign-in",
    SIGN_UP : "/sign-up",
    COMMUNITY : "/community",
    COLLECTIONS : "/collections",
    JOBS : "/jobs",
    TAGS : "/tags",
    PROFILE : (id:string|null) => `/profile/${id}`,
    ASK_QUESTION : "/ask-question",
    QUESTION: (id: string) => `/questions/${id}`,
    TAG: (id: string) => `/tags/${id}`,
}   

export default ROUTES