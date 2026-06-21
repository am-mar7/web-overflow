/**
 * Web-Overflow MongoDB Seed Script
 * Run with: node scripts/seed.js
 *
 * Make sure your MONGODB_URI is set in .env.local before running,
 * or export it directly: export MONGODB_URI="your-uri"
 */

const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ─── Schema definitions (mirrors the TS models) ───────────────────────────────

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: String,
    image: String,
    portfolio: String,
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TagSchema = new mongoose.Schema(
  { name: { type: String, required: true, unique: true }, questions: { type: Number, default: 0 } },
  { timestamps: true }
);

const QuestionSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AnswerSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TagQuestionSchema = new mongoose.Schema(
  {
    tag: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const VoteSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

const CollectionSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const AccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    password: String,
    image: String,
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true }
);

const InteractionSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, enum: ["view", "upvote", "downvote", "bookmark", "post", "edit", "delete", "search"], required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true }
);

const ViewQuestionSchema = new mongoose.Schema(
  {
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

// ─── Models ───────────────────────────────────────────────────────────────────

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
const Answer = mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);
const TagQuestion = mongoose.models.TagQuestion || mongoose.model("TagQuestion", TagQuestionSchema);
const Vote = mongoose.models.Vote || mongoose.model("Vote", VoteSchema);
const Collection = mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);
const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);
const Interaction = mongoose.models.Interaction || mongoose.model("Interaction", InteractionSchema);
const ViewQuestion = mongoose.models.ViewQuestion || mongoose.model("ViewQuestion", ViewQuestionSchema);

// ─── Seed data ────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: "devOverFlow" });
  console.log("✅  Connected to MongoDB");

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Tag.deleteMany({}),
    Question.deleteMany({}),
    Answer.deleteMany({}),
    TagQuestion.deleteMany({}),
    Vote.deleteMany({}),
    Collection.deleteMany({}),
    Account.deleteMany({}),
    Interaction.deleteMany({}),
    ViewQuestion.deleteMany({}),
  ]);
  console.log("🗑️   Cleared all collections");

  // ── Users ──────────────────────────────────────────────────────────────────
  const users = await User.insertMany([
    {
      name: "Ammar Al-Rawi",
      email: "ammar@devoverflow.dev",
      bio: "Full-stack developer passionate about React and Node.js. Open-source contributor.",
      image: "https://avatars.githubusercontent.com/u/1?v=4",
      portfolio: "https://ammar.dev",
      reputation: 4850,
    },
    {
      name: "Sara Hassan",
      email: "sara@devoverflow.dev",
      bio: "Backend engineer specializing in distributed systems and databases.",
      image: "https://avatars.githubusercontent.com/u/2?v=4",
      portfolio: "https://sarahassan.io",
      reputation: 3200,
    },
    {
      name: "Khalid Noor",
      email: "khalid@devoverflow.dev",
      bio: "DevOps enthusiast and cloud architect. AWS certified.",
      image: "https://avatars.githubusercontent.com/u/3?v=4",
      portfolio: "https://khalidnoor.me",
      reputation: 2750,
    },
    {
      name: "Layla Ibrahim",
      email: "layla@devoverflow.dev",
      bio: "Frontend developer in love with UI/UX and accessibility.",
      image: "https://avatars.githubusercontent.com/u/4?v=4",
      portfolio: "https://laylaibrahim.com",
      reputation: 1900,
    },
    {
      name: "Omar Farouk",
      email: "omar@devoverflow.dev",
      bio: "Machine learning engineer and Python advocate.",
      image: "https://avatars.githubusercontent.com/u/5?v=4",
      portfolio: "https://omarfarouk.ai",
      reputation: 5600,
    },
  ]);
  console.log(`👤  Inserted ${users.length} users`);

  // ── Accounts (credentials provider) ───────────────────────────────────────
  const accounts = await Account.insertMany([
    { userId: users[0]._id, name: "Ammar Al-Rawi", provider: "credentials", providerAccountId: users[0]._id.toString(), password: "$2b$10$placeholder_bcrypt_hash" },
    { userId: users[1]._id, name: "Sara Hassan", provider: "github", providerAccountId: "gh_sara_123" },
    { userId: users[2]._id, name: "Khalid Noor", provider: "google", providerAccountId: "google_khalid_456" },
    { userId: users[3]._id, name: "Layla Ibrahim", provider: "credentials", providerAccountId: users[3]._id.toString(), password: "$2b$10$placeholder_bcrypt_hash" },
    { userId: users[4]._id, name: "Omar Farouk", provider: "github", providerAccountId: "gh_omar_789" },
  ]);
  console.log(`🔑  Inserted ${accounts.length} accounts`);

  // ── Tags ───────────────────────────────────────────────────────────────────
  const tags = await Tag.insertMany([
    { name: "javascript", questions: 3 },
    { name: "typescript", questions: 2 },
    { name: "react", questions: 2 },
    { name: "nextjs", questions: 2 },
    { name: "nodejs", questions: 1 },
    { name: "mongodb", questions: 1 },
    { name: "css", questions: 1 },
    { name: "python", questions: 1 },
    { name: "docker", questions: 1 },
    { name: "git", questions: 1 },
  ]);
  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t._id]));
  console.log(`🏷️   Inserted ${tags.length} tags`);

  // ── Questions ──────────────────────────────────────────────────────────────
  const questions = await Question.insertMany([
    {
      author: users[0]._id,
      title: "How do I use async/await properly inside a forEach loop in JavaScript?",
      content: `I'm trying to run async operations inside a \`forEach\` loop but they don't seem to be awaited properly.\n\n\`\`\`js\nconst ids = [1, 2, 3];\nids.forEach(async (id) => {\n  const result = await fetchData(id);\n  console.log(result);\n});\nconsole.log('done');\n\`\`\`\n\nThe "done" message appears before the results. What am I doing wrong?`,
      tags: [tagMap["javascript"]],
      views: 312,
      answers: 2,
      upvotes: 45,
      downvotes: 2,
    },
    {
      author: users[1]._id,
      title: "What is the difference between 'interface' and 'type' in TypeScript?",
      content: `I keep seeing both \`interface\` and \`type\` used interchangeably in TypeScript projects. When should I prefer one over the other?\n\n\`\`\`ts\ninterface User { name: string; age: number; }\ntype User = { name: string; age: number; };\n\`\`\`\n\nAre there performance or structural differences?`,
      tags: [tagMap["typescript"]],
      views: 890,
      answers: 3,
      upvotes: 112,
      downvotes: 4,
    },
    {
      author: users[2]._id,
      title: "How to properly fetch data in Next.js 14 using the App Router?",
      content: `I recently migrated to Next.js 14 with the App Router. I'm confused about when to use \`fetch\` directly in Server Components vs using a separate data-fetching hook.\n\nShould I use:\n- \`fetch\` in a Server Component\n- \`useSWR\` / \`react-query\` in a Client Component\n- Some other pattern?\n\nWhat are the best practices?`,
      tags: [tagMap["nextjs"], tagMap["react"]],
      views: 1420,
      answers: 2,
      upvotes: 98,
      downvotes: 1,
    },
    {
      author: users[3]._id,
      title: "How to center a div both horizontally and vertically with CSS?",
      content: `This is a classic question but I always forget the cleanest modern approach. What's the best way to center a \`div\` in 2024 using CSS?\n\n\`\`\`html\n<div class=\"container\">\n  <div class=\"box\">Center me!</div>\n</div>\n\`\`\`\n\nI've seen Flexbox, Grid, and absolute positioning approaches.`,
      tags: [tagMap["css"]],
      views: 2100,
      answers: 3,
      upvotes: 215,
      downvotes: 7,
    },
    {
      author: users[4]._id,
      title: "What's the best way to handle environment variables in a Next.js + MongoDB project?",
      content: `I have a Next.js application that connects to MongoDB. I'm not sure how to securely handle env variables for both development and production.\n\nCurrently I'm using \`.env.local\` with \`MONGODB_URI\` but I'm worried about accidentally exposing them. Should I prefix them with \`NEXT_PUBLIC_\`? What's the recommended approach?`,
      tags: [tagMap["nextjs"], tagMap["mongodb"]],
      views: 670,
      answers: 2,
      upvotes: 67,
      downvotes: 0,
    },
    {
      author: users[0]._id,
      title: "How to avoid callback hell in Node.js?",
      content: `I'm building a REST API with Node.js and I keep ending up with deeply nested callbacks:\n\n\`\`\`js\ngetUser(id, (err, user) => {\n  getPosts(user.id, (err, posts) => {\n    getComments(posts[0].id, (err, comments) => {\n      // ...\n    });\n  });\n});\n\`\`\`\n\nWhat patterns can I use to flatten this?`,
      tags: [tagMap["nodejs"], tagMap["javascript"]],
      views: 540,
      answers: 2,
      upvotes: 78,
      downvotes: 3,
    },
    {
      author: users[1]._id,
      title: "How do React hooks replace lifecycle methods?",
      content: `Coming from class components, I'm trying to understand the equivalent of \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\` using hooks.\n\nCan someone provide a side-by-side comparison?`,
      tags: [tagMap["react"], tagMap["javascript"]],
      views: 765,
      answers: 2,
      upvotes: 134,
      downvotes: 2,
    },
    {
      author: users[2]._id,
      title: "How do I containerize a Node.js app with Docker?",
      content: `I want to Dockerize my Node.js Express app. I've written a basic Dockerfile but it seems bloated and slow to build.\n\n\`\`\`dockerfile\nFROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD [\"node\", \"index.js\"]\n\`\`\`\n\nWhat are the best practices for production-ready Docker images for Node.js?`,
      tags: [tagMap["docker"], tagMap["nodejs"]],
      views: 430,
      answers: 2,
      upvotes: 55,
      downvotes: 1,
    },
    {
      author: users[3]._id,
      title: "What's the difference between 'git merge' and 'git rebase'?",
      content: `I know both commands integrate changes from one branch to another, but I'm not sure when to use each one.\n\nCan someone explain the conceptual difference and give practical examples of when to prefer \`merge\` vs \`rebase\`?`,
      tags: [tagMap["git"]],
      views: 980,
      answers: 2,
      upvotes: 189,
      downvotes: 5,
    },
    {
      author: users[4]._id,
      title: "How to use list comprehensions in Python effectively?",
      content: `I understand the basic syntax of list comprehensions in Python:\n\n\`\`\`python\nsquares = [x**2 for x in range(10)]\n\`\`\`\n\nBut when should I avoid them? Are there performance considerations vs regular \`for\` loops? What about nested comprehensions?`,
      tags: [tagMap["python"]],
      views: 315,
      answers: 2,
      upvotes: 82,
      downvotes: 1,
    },
  ]);
  console.log(`❓  Inserted ${questions.length} questions`);

  // ── TagQuestion join table ─────────────────────────────────────────────────
  const tagQuestionDocs = [];
  for (const q of questions) {
    for (const tagId of q.tags) {
      tagQuestionDocs.push({ tag: tagId, question: q._id });
    }
  }
  await TagQuestion.insertMany(tagQuestionDocs);
  console.log(`🔗  Inserted ${tagQuestionDocs.length} tag-question links`);

  // ── Answers ────────────────────────────────────────────────────────────────
  const answers = await Answer.insertMany([
    // Q1 - async/await forEach
    {
      author: users[1]._id,
      question: questions[0]._id,
      content: `\`forEach\` doesn't wait for async callbacks to resolve. Use \`for...of\` instead:\n\n\`\`\`js\nfor (const id of ids) {\n  const result = await fetchData(id);\n  console.log(result);\n}\nconsole.log('done');\n\`\`\`\n\nOr if you want parallel execution: \`await Promise.all(ids.map(fetchData))\``,
      upvotes: 38,
      downvotes: 0,
    },
    {
      author: users[4]._id,
      question: questions[0]._id,
      content: `Great question! The issue is that \`forEach\` ignores the return value of its callback, so the Promises are never awaited.\n\nFor sequential execution: \`for...of\`\nFor parallel execution: \`Promise.all + map\`\n\nChoose based on whether the operations are independent.`,
      upvotes: 12,
      downvotes: 1,
    },
    // Q2 - interface vs type
    {
      author: users[0]._id,
      question: questions[1]._id,
      content: `Key differences:\n- **Merging**: \`interface\` supports declaration merging, \`type\` does not.\n- **Extends**: Both can extend, but syntax differs.\n- **Unions/Intersections**: Only \`type\` can express union types (\`A | B\`).\n\nGeneral rule: use \`interface\` for object shapes, \`type\` for everything else.`,
      upvotes: 95,
      downvotes: 2,
    },
    {
      author: users[3]._id,
      question: questions[1]._id,
      content: `Performance-wise there's no runtime difference — TypeScript erases types at compile time. The distinction is purely structural/stylistic. The TypeScript team recommends \`interface\` for public APIs due to better error messages.`,
      upvotes: 44,
      downvotes: 0,
    },
    // Q3 - Next.js data fetching
    {
      author: users[4]._id,
      question: questions[2]._id,
      content: `In Next.js 14 App Router the recommended pattern is:\n1. **Server Components** — fetch directly with the native \`fetch\` API; results are cached automatically.\n2. **Client Components** — use \`useSWR\` or React Query for interactive, client-side data fetching.\n\nAvoid mixing server-side fetches into client components.`,
      upvotes: 72,
      downvotes: 0,
    },
    {
      author: users[0]._id,
      question: questions[2]._id,
      content: `Also worth noting: Next.js 14 extends the native \`fetch\` with \`{ next: { revalidate: N } }\` for ISR. You can deduplicate requests by calling \`fetch\` in multiple server components — Next caches them automatically.`,
      upvotes: 55,
      downvotes: 1,
    },
    // Q4 - center a div
    {
      author: users[2]._id,
      question: questions[3]._id,
      content: `**Flexbox (recommended):**\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\`\`\``,
      upvotes: 180,
      downvotes: 3,
    },
    {
      author: users[1]._id,
      question: questions[3]._id,
      content: `**CSS Grid (cleanest one-liner):**\n\`\`\`css\n.container {\n  display: grid;\n  place-items: center;\n  height: 100vh;\n}\n\`\`\``,
      upvotes: 145,
      downvotes: 2,
    },
    // Q5 - env variables
    {
      author: users[0]._id,
      question: questions[4]._id,
      content: `Never prefix server-only secrets with \`NEXT_PUBLIC_\`. That exposes them to the browser bundle.\n\n- Use \`.env.local\` for local dev (git-ignored by default)\n- Set variables directly in your hosting provider (Vercel, Railway, etc.) for production\n- Only expose truly public values with \`NEXT_PUBLIC_\``,
      upvotes: 60,
      downvotes: 0,
    },
    {
      author: users[3]._id,
      question: questions[4]._id,
      content: `Additionally, validate your env vars at startup using a library like \`zod\`:\n\n\`\`\`ts\nimport { z } from 'zod';\nconst envSchema = z.object({ MONGODB_URI: z.string().url() });\nenvSchema.parse(process.env);\n\`\`\`\n\nThis prevents your app from starting with a missing/malformed URI.`,
      upvotes: 48,
      downvotes: 0,
    },
    // Q6 - callback hell
    {
      author: users[2]._id,
      question: questions[5]._id,
      content: `Use \`async/await\` with promises:\n\n\`\`\`js\nasync function main() {\n  const user = await getUser(id);\n  const posts = await getPosts(user.id);\n  const comments = await getComments(posts[0].id);\n}\n\`\`\``,
      upvotes: 65,
      downvotes: 1,
    },
    {
      author: users[4]._id,
      question: questions[5]._id,
      content: `Another option is to use named functions to break the nesting, or adopt a library like \`async\` (npm) for more complex control-flow patterns like \`async.waterfall\`.`,
      upvotes: 22,
      downvotes: 0,
    },
    // Q7 - React hooks
    {
      author: users[0]._id,
      question: questions[6]._id,
      content: `| Lifecycle | Hook equivalent |\n|---|---|\n| componentDidMount | useEffect(() => {}, []) |\n| componentDidUpdate | useEffect(() => {}, [dep]) |\n| componentWillUnmount | return () => cleanup() inside useEffect |`,
      upvotes: 110,
      downvotes: 0,
    },
    {
      author: users[3]._id,
      question: questions[6]._id,
      content: `Worth noting: a single \`useEffect\` can cover all three cases. The cleanup function returned from the effect runs on unmount and before the next effect run if dependencies change.`,
      upvotes: 58,
      downvotes: 1,
    },
    // Q8 - Docker
    {
      author: users[1]._id,
      question: questions[7]._id,
      content: `Use multi-stage builds and alpine images:\n\n\`\`\`dockerfile\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\n\nFROM node:18-alpine\nWORKDIR /app\nCOPY --from=builder /app .\nCMD [\"node\", \"index.js\"]\n\`\`\``,
      upvotes: 47,
      downvotes: 0,
    },
    {
      author: users[4]._id,
      question: questions[7]._id,
      content: `Always add a \`.dockerignore\` file to exclude \`node_modules\`, \`.git\`, and \`.env\` files. This dramatically reduces image size and build time.`,
      upvotes: 33,
      downvotes: 0,
    },
    // Q9 - git merge vs rebase
    {
      author: users[0]._id,
      question: questions[8]._id,
      content: `**Merge** preserves the full branch history and creates a merge commit. Good for feature branches.\n\n**Rebase** rewrites commits onto the target branch tip for a linear history. Good for keeping a clean main branch.\n\nRule of thumb: never rebase commits that have been pushed to a shared remote.`,
      upvotes: 160,
      downvotes: 4,
    },
    {
      author: users[2]._id,
      question: questions[8]._id,
      content: `Use \`git merge --no-ff\` to always create a merge commit even for fast-forwards — this documents when feature branches were integrated. Use rebase for personal/local cleanup before opening a PR.`,
      upvotes: 77,
      downvotes: 1,
    },
    // Q10 - Python list comprehensions
    {
      author: users[1]._id,
      question: questions[9]._id,
      content: `List comprehensions are idiomatic Python and often faster than equivalent \`for\` loops because the iteration is implemented in C internally. Avoid them when the logic becomes hard to read — if it's more than two conditions/nesting levels, a regular loop is clearer.`,
      upvotes: 70,
      downvotes: 0,
    },
    {
      author: users[3]._id,
      question: questions[9]._id,
      content: `Use **generator expressions** instead of list comprehensions when you don't need the full list in memory:\n\n\`\`\`python\ntotal = sum(x**2 for x in range(1_000_000))  # no list created\n\`\`\``,
      upvotes: 55,
      downvotes: 0,
    },
  ]);
  console.log(`💬  Inserted ${answers.length} answers`);

  // ── Votes ──────────────────────────────────────────────────────────────────
  const votes = await Vote.insertMany([
    { author: users[1]._id, targetId: questions[0]._id, targetType: "question", voteType: "upvote" },
    { author: users[2]._id, targetId: questions[0]._id, targetType: "question", voteType: "upvote" },
    { author: users[3]._id, targetId: questions[1]._id, targetType: "question", voteType: "upvote" },
    { author: users[4]._id, targetId: questions[1]._id, targetType: "question", voteType: "upvote" },
    { author: users[0]._id, targetId: questions[2]._id, targetType: "question", voteType: "upvote" },
    { author: users[1]._id, targetId: questions[3]._id, targetType: "question", voteType: "upvote" },
    { author: users[2]._id, targetId: questions[3]._id, targetType: "question", voteType: "upvote" },
    { author: users[0]._id, targetId: answers[0]._id, targetType: "answer", voteType: "upvote" },
    { author: users[3]._id, targetId: answers[0]._id, targetType: "answer", voteType: "upvote" },
    { author: users[2]._id, targetId: answers[2]._id, targetType: "answer", voteType: "upvote" },
    { author: users[4]._id, targetId: answers[4]._id, targetType: "answer", voteType: "upvote" },
    { author: users[1]._id, targetId: answers[6]._id, targetType: "answer", voteType: "upvote" },
    { author: users[0]._id, targetId: questions[8]._id, targetType: "question", voteType: "upvote" },
    { author: users[3]._id, targetId: questions[9]._id, targetType: "question", voteType: "upvote" },
    { author: users[4]._id, targetId: answers[16]._id, targetType: "answer", voteType: "upvote" },
  ]);
  console.log(`👍  Inserted ${votes.length} votes`);

  // ── Collections (bookmarks) ────────────────────────────────────────────────
  const collections = await Collection.insertMany([
    { author: users[0]._id, question: questions[1]._id },
    { author: users[0]._id, question: questions[3]._id },
    { author: users[1]._id, question: questions[2]._id },
    { author: users[1]._id, question: questions[8]._id },
    { author: users[2]._id, question: questions[6]._id },
    { author: users[3]._id, question: questions[0]._id },
    { author: users[3]._id, question: questions[9]._id },
    { author: users[4]._id, question: questions[3]._id },
    { author: users[4]._id, question: questions[7]._id },
  ]);
  console.log(`🔖  Inserted ${collections.length} bookmarks`);

  // ── Interactions ───────────────────────────────────────────────────────────
  const interactions = await Interaction.insertMany([
    { authorId: users[1]._id, actionId: questions[0]._id, action: "upvote", actionType: "question" },
    { authorId: users[2]._id, actionId: questions[0]._id, action: "view", actionType: "question" },
    { authorId: users[3]._id, actionId: questions[1]._id, action: "upvote", actionType: "question" },
    { authorId: users[0]._id, actionId: questions[2]._id, action: "post", actionType: "question" },
    { authorId: users[4]._id, actionId: answers[4]._id, action: "post", actionType: "answer" },
    { authorId: users[1]._id, actionId: questions[3]._id, action: "bookmark", actionType: "question" },
    { authorId: users[2]._id, actionId: answers[0]._id, action: "upvote", actionType: "answer" },
    { authorId: users[3]._id, actionId: questions[8]._id, action: "view", actionType: "question" },
  ]);
  console.log(`⚡  Inserted ${interactions.length} interactions`);

  // ── ViewQuestions ──────────────────────────────────────────────────────────
  const viewQuestions = await ViewQuestion.insertMany([
    { viewer: users[1]._id, questionId: questions[0]._id },
    { viewer: users[2]._id, questionId: questions[0]._id },
    { viewer: users[0]._id, questionId: questions[1]._id },
    { viewer: users[4]._id, questionId: questions[1]._id },
    { viewer: users[3]._id, questionId: questions[2]._id },
    { viewer: users[0]._id, questionId: questions[3]._id },
    { viewer: users[1]._id, questionId: questions[3]._id },
    { viewer: users[2]._id, questionId: questions[3]._id },
    { viewer: users[4]._id, questionId: questions[8]._id },
    { viewer: users[0]._id, questionId: questions[9]._id },
  ]);
  console.log(`👁️   Inserted ${viewQuestions.length} view records`);

  await mongoose.disconnect();
  console.log("\n🎉  Seeding complete! Here is a summary:");
  console.log(`   Users: ${users.length}`);
  console.log(`   Accounts: ${accounts.length}`);
  console.log(`   Tags: ${tags.length}`);
  console.log(`   Questions: ${questions.length}`);
  console.log(`   Answers: ${answers.length}`);
  console.log(`   TagQuestion links: ${tagQuestionDocs.length}`);
  console.log(`   Votes: ${votes.length}`);
  console.log(`   Collections/Bookmarks: ${collections.length}`);
  console.log(`   Interactions: ${interactions.length}`);
  console.log(`   ViewQuestions: ${viewQuestions.length}`);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
