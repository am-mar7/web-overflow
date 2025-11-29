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

export const techDescriptionMap: { [key: string]: string } = {
  // JavaScript variations
  javascript: "a versatile programming language primarily used for web development, enabling interactive and dynamic content on websites",
  js: "a versatile programming language primarily used for web development, enabling interactive and dynamic content on websites",

  // TypeScript variations
  typescript: "a strongly typed programming language that builds on JavaScript, adding static type definitions for better code quality and developer experience",
  ts: "a strongly typed programming language that builds on JavaScript, adding static type definitions for better code quality and developer experience",

  // React variations
  react: "a popular JavaScript library for building user interfaces, particularly single-page applications with reusable components",
  reactjs: "a popular JavaScript library for building user interfaces, particularly single-page applications with reusable components",

  // Next.js variations
  nextjs: "a React framework that enables server-side rendering, static site generation, and provides an excellent developer experience for building modern web applications",
  next: "a React framework that enables server-side rendering, static site generation, and provides an excellent developer experience for building modern web applications",

  // Node.js variations
  nodejs: "a JavaScript runtime built on Chrome's V8 engine that allows developers to run JavaScript on the server-side",
  node: "a JavaScript runtime built on Chrome's V8 engine that allows developers to run JavaScript on the server-side",

  // Bun.js variations
  bun: "a fast all-in-one JavaScript runtime and toolkit designed as a drop-in replacement for Node.js, featuring built-in bundling, testing, and package management",
  bunjs: "a fast all-in-one JavaScript runtime and toolkit designed as a drop-in replacement for Node.js, featuring built-in bundling, testing, and package management",

  // Deno.js variations
  deno: "a secure runtime for JavaScript and TypeScript that aims to be a productive and secure scripting environment for the modern programmer",
  denojs: "a secure runtime for JavaScript and TypeScript that aims to be a productive and secure scripting environment for the modern programmer",

  // Python variations
  python: "a high-level, interpreted programming language known for its simplicity and readability, widely used in web development, data science, and automation",

  // Java variations
  java: "a class-based, object-oriented programming language designed to have minimal implementation dependencies, widely used for enterprise applications",

  // C++ variations
  "c++": "a powerful general-purpose programming language that supports procedural, object-oriented, and generic programming, commonly used for system software and game development",
  cpp: "a powerful general-purpose programming language that supports procedural, object-oriented, and generic programming, commonly used for system software and game development",

  // C# variations
  "c#": "a modern, object-oriented programming language developed by Microsoft, primarily used for building Windows applications and games with Unity",
  csharp: "a modern, object-oriented programming language developed by Microsoft, primarily used for building Windows applications and games with Unity",

  // PHP variations
  php: "a server-side scripting language designed for web development, powering millions of websites and content management systems like WordPress",

  // HTML variations
  html: "the standard markup language for creating web pages and web applications, providing the structure and content of websites",
  html5: "the latest version of HTML, introducing new semantic elements, multimedia support, and improved APIs for modern web development",

  // CSS variations
  css: "a stylesheet language used to describe the presentation and styling of HTML documents, controlling layout, colors, and fonts",
  css3: "the latest evolution of CSS, introducing advanced features like animations, transitions, flexbox, and grid layouts",

  // Git variations
  git: "a distributed version control system for tracking changes in source code during software development, enabling collaboration among developers",

  // Docker variations
  docker: "a platform for developing, shipping, and running applications in containers, ensuring consistency across different environments",

  // MongoDB variations
  mongodb: "a popular NoSQL database that stores data in flexible, JSON-like documents, offering high performance and scalability",
  mongo: "a popular NoSQL database that stores data in flexible, JSON-like documents, offering high performance and scalability",

  // MySQL variations
  mysql: "an open-source relational database management system based on SQL, widely used for web applications and data warehousing",

  // PostgreSQL variations
  postgresql: "a powerful, open-source object-relational database system known for its reliability, feature robustness, and performance",
  postgres: "a powerful, open-source object-relational database system known for its reliability, feature robustness, and performance",

  // AWS variations
  aws: "Amazon Web Services, a comprehensive cloud computing platform offering on-demand services like computing power, storage, and databases",
  "amazon web services": "a comprehensive cloud computing platform offering on-demand services like computing power, storage, and databases",

  // Tailwind CSS variations
  tailwind: "a utility-first CSS framework that provides low-level utility classes for building custom designs without writing custom CSS",
  tailwindcss: "a utility-first CSS framework that provides low-level utility classes for building custom designs without writing custom CSS",

  // Additional popular technologies
  vue: "a progressive JavaScript framework for building user interfaces, known for its gentle learning curve and flexible architecture",
  vuejs: "a progressive JavaScript framework for building user interfaces, known for its gentle learning curve and flexible architecture",

  angular: "a TypeScript-based web application framework developed by Google, providing a complete solution for building large-scale applications",

  express: "a minimal and flexible Node.js web application framework that provides robust features for web and mobile applications",
  expressjs: "a minimal and flexible Node.js web application framework that provides robust features for web and mobile applications",

  django: "a high-level Python web framework that encourages rapid development and clean, pragmatic design",

  flask: "a lightweight Python web framework that provides the essentials for web development with flexibility and simplicity",

  graphql: "a query language and runtime for APIs that allows clients to request exactly the data they need",

  redux: "a predictable state container for JavaScript applications, commonly used with React for managing application state",

  webpack: "a static module bundler for JavaScript applications, processing and bundling assets for optimized deployment",

  vite: "a modern frontend build tool that provides a fast development experience with instant server start and lightning-fast HMR",

  sass: "a CSS preprocessor that adds features like variables, nesting, and mixins to make CSS more maintainable and powerful",
  scss: "a CSS preprocessor that adds features like variables, nesting, and mixins to make CSS more maintainable and powerful",

  bootstrap: "a popular CSS framework for building responsive, mobile-first websites with pre-designed components and utilities",

  redis: "an in-memory data structure store used as a database, cache, and message broker, known for its exceptional performance",

  kubernetes: "an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications",

  firebase: "a comprehensive app development platform by Google, providing backend services like authentication, databases, and hosting",

  graphite: "a highly scalable real-time graphing system used for monitoring and visualizing time-series data",
};

