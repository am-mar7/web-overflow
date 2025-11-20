import ROUTES from "./routes";

export const sidebarLinks = [
    {
      imgURL: "/icons/home.svg",
      route: ROUTES.HOME,
      label: "Home",
    },
    {
      imgURL: "/icons/users.svg",
      route: ROUTES.COMMUNITY,
      label: "Community",
    },
    {
      imgURL: "/icons/star.svg",
      route: ROUTES.COLLECTIONS,
      label: "Collections",
    },
    {
      imgURL: "/icons/suitcase.svg",
      route: ROUTES.JOBS,
      label: "Find Jobs",
    },
    {
      imgURL: "/icons/tag.svg",
      route: ROUTES.TAGS,
      label: "Tags",
    },
    {
      imgURL: "/icons/user.svg",
      route: ROUTES.PROFILE,
      label: "Profile",
    },
    {
      imgURL: "/icons/question.svg",
      route: ROUTES.ASK_QUESTION,
      label: "Ask a question",
    },
];

export  const techMap: { [key: string]: string } = {
  // JavaScript variations
  javascript: "devicon-javascript-plain",
  js: "devicon-javascript-plain",

  // TypeScript variations
  typescript: "devicon-typescript-plain",
  ts: "devicon-typescript-plain",

  // React variations
  react: "devicon-react-original",
  reactjs: "devicon-react-original",

  // Next.js variations
  nextjs: "devicon-nextjs-plain",
  next: "devicon-nextjs-plain",

  // Node.js variations
  nodejs: "devicon-nodejs-plain",
  node: "devicon-nodejs-plain",

  // Bun.js variations
  bun: "devicon-bun-plain",
  bunjs: "devicon-bun-plain",

  // Deno.js variations
  deno: "devicon-denojs-original",
  denojs: "devicon-denojs-plain",

  // Python variations
  python: "devicon-python-plain",

  // Java variations
  java: "devicon-java-plain",

  // C++ variations
  "c++": "devicon-cplusplus-plain",
  cpp: "devicon-cplusplus-plain",

  // C# variations
  "c#": "devicon-csharp-plain",
  csharp: "devicon-csharp-plain",

  // PHP variations
  php: "devicon-php-plain",

  // HTML variations
  html: "devicon-html5-plain",
  html5: "devicon-html5-plain",

  // CSS variations
  css: "devicon-css3-plain",
  css3: "devicon-css3-plain",

  // Git variations
  git: "devicon-git-plain",

  // Docker variations
  docker: "devicon-docker-plain",

  // MongoDB variations
  mongodb: "devicon-mongodb-plain",
  mongo: "devicon-mongodb-plain",

  // MySQL variations
  mysql: "devicon-mysql-plain",

  // PostgreSQL variations
  postgresql: "devicon-postgresql-plain",
  postgres: "devicon-postgresql-plain",

  // AWS variations
  aws: "devicon-amazonwebservices-original",
  "amazon web services": "devicon-amazonwebservices-original",

  // Tailwind CSS variations
  tailwind: "devicon-tailwindcss-original",
  tailwindcss: "devicon-tailwindcss-original",
};