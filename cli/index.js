#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topic = process.argv[2];

if (!topic) {
  console.log(chalk.yellow('\n📘 DevDocsX - Offline Documentation\n'));
  console.log(chalk.white('Usage: npx devdocsx <topic>\n'));
  console.log(chalk.cyan('Available topics:'));
  console.log(chalk.white('  JavaScript:'));
  console.log(chalk.gray('    javascript/arrays, javascript/objects, javascript/functions'));
  console.log(chalk.gray('    javascript/promises, javascript/async-await, javascript/closures'));
  console.log(chalk.gray('    javascript/prototypes, javascript/classes, javascript/array-methods'));
  console.log(chalk.gray('    javascript/object-methods, javascript/string-methods'));
  console.log(chalk.white('\n  Node.js:'));
  console.log(chalk.gray('    node/server, node/fs-module, node/path-module'));
  console.log(chalk.gray('    node/events, node/os-module, node/streams'));
  console.log(chalk.white('\n  Express:'));
  console.log(chalk.gray('    express/setup, express/routing, express/middleware'));
  console.log(chalk.gray('    express/error-handling, express/cookie-parser, express/auth-flow'));
  console.log(chalk.gray('    express/file-uploads'));
  console.log(chalk.white('\n  Prisma:'));
  console.log(chalk.gray('    prisma/setup, prisma/schema, prisma/crud'));
  console.log(chalk.gray('    prisma/filters, prisma/relations, prisma/transactions, prisma/pagination'));
  console.log(chalk.white('\n  Auth:'));
  console.log(chalk.gray('    auth/jwt, auth/session, auth/bcrypt'));
  console.log(chalk.gray('    auth/cookies, auth/token-verification, auth/best-practices'));
  console.log(chalk.white('\n  Cheatsheets:'));
  console.log(chalk.gray('    cheatsheets/javascript, cheatsheets/node, cheatsheets/express'));
  console.log(chalk.gray('    cheatsheets/prisma, cheatsheets/auth'));
  console.log(chalk.white('\n  Interview:'));
  console.log(chalk.gray('    interview/javascript-questions, interview/backend-questions'));
  console.log(chalk.gray('    interview/express-questions, interview/prisma-questions, interview/auth-questions'));
  console.log(chalk.white('\n  🚀 Advanced Topics (add .adv):'));
  console.log(chalk.gray('    express/file-uploads.adv, express/middleware.adv'));
  console.log(chalk.gray('    node/fs-module.adv, node/streams.adv'));
  console.log(chalk.gray('    prisma/crud.adv, javascript/async-await.adv'));
  console.log(chalk.white('\nExamples:'));
  console.log(chalk.gray('  npx devdocsx javascript/arrays'));
  console.log(chalk.gray('  npx devdocsx express/file-uploads.adv\n'));
  process.exit(0);
}

const docPath = path.resolve(__dirname, '..', 'docs', `${topic}.md`);
const advDocPath = path.resolve(__dirname, '..', 'docs', `${topic}.adv.md`);

if (fs.existsSync(docPath)) {
  console.log(chalk.greenBright(`\n📘 Reading documentation for: ${topic}\n`));
  const content = fs.readFileSync(docPath, 'utf8');
  console.log(chalk.white(content));
  console.log(chalk.gray('\n─────────────────────────────────────────────────────'));
  
  // Check for advanced documentation
  if (fs.existsSync(advDocPath)) {
    console.log(chalk.magenta(`\n🚀 Advanced documentation available!`));
    console.log(chalk.gray(`   Run: npx devdocsx ${topic}.adv\n`));
  }
  
  console.log(chalk.cyan(`\n💡 Tip: You can also open this file directly at:`));
  console.log(chalk.gray(`   ${docPath}\n`));
} else if (fs.existsSync(advDocPath)) {
  console.log(chalk.greenBright(`\n🚀 Reading advanced documentation for: ${topic.replace('.adv', '')}\n`));
  const content = fs.readFileSync(advDocPath, 'utf8');
  console.log(chalk.white(content));
  console.log(chalk.gray('\n─────────────────────────────────────────────────────'));
  console.log(chalk.cyan(`\n💡 Tip: You can also open this file directly at:`));
  console.log(chalk.gray(`   ${advDocPath}\n`));
} else {
  console.log(chalk.red(`\n❌ Topic not found: ${topic}\n`));
  console.log(chalk.yellow('Run "npx devdocsx" without arguments to see available topics.\n'));
  process.exit(1);
}
