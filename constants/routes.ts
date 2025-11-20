const ROUTES = {
    HOME : "/",
    SIGN_IN : "/sign-in",
    SIGN_UP : "/sign-up",
    COMMUNITY : "/community",
    COLLECTIONS : "/collection",
    JOBS : "/jobs",
    TAGS : "tags",
    // PROFILE : (id:string) => `/profile/${id}`,
    PROFILE :  "/profile",
    ASK_QUESTION : "/ask-question",
    QUESTION: (id: string) => `/questions/${id}`,
    TAG: (id: string) => `/tags/${id}`,
}   

export default ROUTES