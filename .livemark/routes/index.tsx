import { Link, createFileRoute } from "@tanstack/react-router"
import {
  BookOpen,
  CheckCircle2,
  EyeOff,
  FileCode2,
  FolderTree,
  Github,
  Layers,
  Network,
  Rocket,
  ShieldCheck,
  SquareTerminal,
  Terminal,
  Zap,
} from "lucide-react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { BackToTop } from "livemark/components/BackToTop"
import { Banner } from "livemark/components/Banner"
import { Header } from "livemark/components/Header"
import { buttonVariants } from "livemark/elements/button"
import { useInView } from "livemark/hooks/in-view"
import { cn } from "cn"

export const Route = createFileRoute("/")({
  component: Landing,
})

function Landing() {
  return (
    <>
      <Banner />
      <Header />
      <main className="flex flex-col">
        <Hero />
        <Freedom />
        <Features />
        <Showcase />
        <FinalCta />
        <Datist />
      </main>
      <BackToTop />
    </>
  )
}

const tk = {
  comment: "text-[#9ca0b0] dark:text-[#6c7086]",
  keyword: "text-[#8839ef] dark:text-[#cba6f7]",
  type: "text-[#df8e1d] dark:text-[#f9e2af]",
  string: "text-[#40a02b] dark:text-[#a6e3a1]",
  func: "text-[#1e66f5] dark:text-[#89b4fa]",
  punct: "text-[#7c7f93] dark:text-[#9399b2]",
  body: "text-[#4c4f69] dark:text-[#cdd6f4]",
  dim: "text-[#9ca0b0] dark:text-[#6c7086]",
  flag: "text-[#179299] dark:text-[#94e2d5]",
  prompt: "text-[#d20f39] dark:text-[#f38ba8]",
  key: "text-[#1e66f5] dark:text-[#89b4fa]",
}

function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden border-b border-border">
      <BackgroundGrid />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28 lg:pt-8 lg:pb-14 lg:grid lg:grid-cols-[27rem_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
          <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            Open source · MIT License
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-5xl">
            TypeScript functions,
            <br />
            <span className="box-decoration-clone bg-linear-to-r from-primary/20 to-primary/20 bg-size-[100%_0.3em] bg-position-[0_88%] bg-no-repeat">
              ready for the CLI.
            </span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            Point uptask at a glob. Every function exported from a matching file becomes a
            command, with arguments, defaults and{" "}
            <code className="font-mono whitespace-nowrap text-foreground">--help</code>{" "}
            taken from its signature and JSDoc.
          </p>
          <HeroActions />
        </div>
        <div className="mt-12 lg:mt-0 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
          <HeroTerminal />
        </div>
      </div>
    </section>
  )
}

function HeroActions() {
  return (
    <>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/$"
          params={{ _splat: "introduction" }}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "px-5 no-underline",
          )}
        >
          <Rocket className="size-4" />
          Get started
        </Link>
        <a
          href="https://github.com/datisthq/uptask"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "px-5 no-underline",
          )}
        >
          <Github className="size-4" />
          View source
        </a>
      </div>
      <div className="mt-6 hidden sm:inline-grid grid-cols-[auto_auto] gap-x-3 gap-y-1 rounded-[1.25rem] border border-border bg-card/50 backdrop-blur px-4 py-2 font-mono text-sm text-muted-foreground">
        <span className="text-primary select-none">$</span>
        <span>
          <span className="text-foreground">pnpm add</span> -D uptask
        </span>
        <span className="text-primary select-none">$</span>
        <span>
          <span className="text-foreground">npm install</span> --save-dev uptask
        </span>
      </div>
    </>
  )
}

const heroTerminal = `$ uptask --help
USAGE uptask [options] [command]

OPTIONS
  -V, --version             output the version number
  -h, --help                display help for command

COMMANDS
  build [options] <target>  Build the project.
  help [command]            display help for command

$ uptask build web --watch
{ target: 'web', watch: true }`

const heroSource = `export function build(
  target: string,
  watch: boolean = false,
)`

function HeroTerminal() {
  return (
    <div className="relative">
      <figure className="overflow-hidden rounded-card border border-border bg-card shadow-xl">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          <figcaption className="ml-2 font-mono text-xs text-muted-foreground">
            terminal
          </figcaption>
        </div>
        <TerminalSample text={heroTerminal} className="lg:pb-32" />
      </figure>
      <div className="mt-4 lg:absolute lg:-bottom-10 lg:-left-10 lg:mt-0 lg:w-[24rem]">
        <SourceChip file="@build.ts" code={heroSource} />
      </div>
    </div>
  )
}

function SourceChip(props: { file: string; code: string }) {
  return (
    <figure className="flex h-full gap-3 rounded-card border border-primary/25 bg-card p-4 shadow-lg">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <SquareTerminal className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
          Just an exported function
        </p>
        <figcaption className="mt-1 font-mono text-xs text-muted-foreground">
          {props.file}
        </figcaption>
        <pre className="mt-2 overflow-x-auto font-mono text-sm leading-relaxed">
          <code className={tk.body}>{highlightSource(props.code)}</code>
        </pre>
      </div>
    </figure>
  )
}

function BackgroundGrid() {
  return (
    <>
      <style href="uptask-hero-background" precedence="default">
        {BACKGROUND_GRID_CSS}
      </style>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent_98%)]">
          <div className="strata strata-drift absolute inset-y-0 -inset-x-11 opacity-50" />
          <div className="hero-scan-x from-primary/0 via-primary/16 to-primary/0 absolute inset-y-0 w-[40%] bg-gradient-to-r" />
          <div className="hero-scan-y from-secondary/0 via-secondary/16 to-secondary/0 absolute inset-x-0 h-[40%] bg-gradient-to-b" />
        </div>
      </div>
      <div
        aria-hidden
        className="hero-drift bg-primary/15 pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full blur-3xl"
      />
    </>
  )
}

const BACKGROUND_GRID_CSS = `
@keyframes hero-scan-x {
  0% {
    transform: translateX(-55%);
    opacity: 0;
  }
  5%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    transform: translateX(155%);
    opacity: 0;
  }
}

@keyframes hero-scan-y {
  0%,
  50% {
    transform: translateY(-55%);
    opacity: 0;
  }
  55%,
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(155%);
    opacity: 0;
  }
}

@keyframes strata-drift {
  to {
    transform: translateX(44px);
  }
}

@keyframes hero-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(6%, -8%, 0) scale(1.08);
  }
}

.strata {
  background-image: repeating-linear-gradient(
    90deg,
    var(--color-border) 0,
    var(--color-border) 1px,
    transparent 1px,
    transparent 44px
  );
}

.strata-drift {
  animation: strata-drift 14s linear infinite;
}

.hero-scan-x {
  animation: hero-scan-x 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hero-scan-y {
  animation: hero-scan-y 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hero-drift {
  animation: hero-drift 18s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-scan-x,
  .hero-scan-y {
    animation: none;
    opacity: 0;
  }
  .strata-drift,
  .hero-drift {
    animation: none;
  }
}
`

interface Point {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: ReactNode
}

const freedoms: Point[] = [
  {
    icon: Layers,
    title: "Plain exported functions",
    description: (
      <>
        No decorators, no wrappers, no DSL to learn. Task files stay ordinary modules you
        can import and test like any other code.
      </>
    ),
  },
  {
    icon: Terminal,
    title: "A real Commander program",
    description: (
      <>
        Every command is a Commander command. The{" "}
        <code className="font-mono text-foreground">setupProgram</code> hook hands you the
        program to rename, add help text or register custom commands. See{" "}
        <DocsLink path="configuration">Configuration</DocsLink>.
      </>
    ),
  },
  {
    icon: Network,
    title: "Groups when you need them",
    description: (
      <>
        Each <code className="font-mono text-foreground">config.groups[]</code> entry
        collects matching files under one parent command; files that match no group stay
        flat. See <DocsLink path="groups">Groups</DocsLink>.
      </>
    ),
  },
]

function DocsLink(props: { path: string; children: ReactNode }) {
  return (
    <Link
      to="/$"
      params={{ _splat: props.path }}
      className="text-primary underline-offset-4 hover:underline"
    >
      {props.children}
    </Link>
  )
}

function Freedom() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Still just TypeScript and Commander
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Uptask fills in the boring parts and gets out of the way. Your functions and
              your Commander setup stay yours.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <ul className="space-y-8">
            {freedoms.map((point, i) => (
              <li key={point.title}>
                <Reveal delayMs={i * 60}>
                  <div className="flex gap-4">
                    <div className="shrink-0 inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                      <point.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <WindowCard label="my-project">
              <TaskTree />
            </WindowCard>
            <p className="mt-3 text-center text-sm text-muted-foreground/60">
              Discovery matches file basenames anywhere in the repo and honors .gitignore.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const taskTree: [string, string, string, string][] = [
  ["", "uptask.config.ts", "config", "groups: db"],
  ["", "@build.ts", "file", "build"],
  ["", "scripts/", "dir", ""],
  ["├─ ", "@release.ts", "file", "release"],
  ["└─ ", "@db.ts", "file", "db migrate, db seed"],
]

function TaskTree() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>
        {taskTree.map(([prefix, name, kind, note]) => (
          <span key={name}>
            <span className={tk.dim}>{prefix}</span>
            <span
              className={kind === "dir" ? tk.flag : kind === "config" ? tk.key : tk.type}
            >
              {name}
            </span>
            {note && (
              <span className={cn(tk.dim, "hidden sm:inline")}>
                {`${" ".repeat(Math.max(1, 20 - prefix.length - name.length))}← ${note}`}
              </span>
            )}
            {"\n"}
          </span>
        ))}
        {"\n"}
        <span className={tk.prompt}>$</span> <span className={tk.func}>uptask</span> db
        migrate prod
        {"\n"}
        <span className={tk.prompt}>$</span> <span className={tk.func}>uptask</span> build
        web <span className={tk.flag}>--watch</span>
      </code>
    </pre>
  )
}

interface Feature {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Zero boilerplate",
    description:
      "Plain exported functions become commands. No config required: the defaults come from package.json.",
  },
  {
    icon: FileCode2,
    title: "Type-driven CLI",
    description:
      "Argument types come straight from TypeScript. Defaults, optionality and nested objects map themselves; JSDoc fills in --help.",
  },
  {
    icon: ShieldCheck,
    title: "Runtime validation",
    description:
      "Inputs are validated against zod schemas built from your function's signature. Bad input gets a clean one-line error.",
  },
  {
    icon: FolderTree,
    title: "Subcommand groups",
    description:
      "Opt into nesting via config.groups[]. Carve the top level into named areas without compound function names.",
  },
  {
    icon: EyeOff,
    title: "Honors .gitignore",
    description:
      "Discovery walks .gitignore up to the repo root, not above. Predictable across machines.",
  },
  {
    icon: Terminal,
    title: "Powered by Commander",
    description:
      "Generated commands are real Commander.js commands. Customize with the setupProgram hook when you need to.",
  },
]

function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything a task runner needs
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Sensible defaults, no setup to start, fully customizable when you need it.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 60}>
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard(props: Feature) {
  return (
    <div className="h-full group relative rounded-card border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
        <props.icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{props.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {props.description}
      </p>
    </div>
  )
}

function Showcase() {
  return (
    <section className="border-b border-border bg-primary/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Write a function. Get a command.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Your <code className="font-mono">.ts</code> files stay as they are; uptask
              does the rest.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <WindowCard label="@build.ts">
              <SourceSample />
            </WindowCard>
            <WindowCard label="terminal">
              <TerminalSample text={showcaseTerminal} />
            </WindowCard>
          </div>
        </Reveal>
        <Reveal delayMs={120}>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Bullet text="JSDoc descriptions surface in --help, next to the defaults." />
            <Bullet text="Required string and number parameters become arguments; optional and boolean ones become --flags." />
            <Bullet text="Every value is checked by zod before your function runs." />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const source = `/**
 * Build the project.
 *
 * @param target Build target name
 * @param watch Enable watch mode
 * @param concurrency Number of parallel builds
 */
export function build(
  target: string,
  watch: boolean = false,
  concurrency: number = 4,
) {
  console.log({ target, watch, concurrency })
}`

function SourceSample() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>{highlightSource(source)}</code>
    </pre>
  )
}

const keywords = new Set(["export", "function", "const", "return", "true", "false"])

const types = new Set(["string", "number", "boolean"])

const SOURCE_TOKEN =
  /("(?:[^"\\]|\\.)*")|(\b\d+\b)|([A-Za-z_]\w*)|([^\sA-Za-z_\d"]+)|(\s+)|([\s\S])/g

function highlightSource(code: string) {
  return code.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 && "\n"}
      {/^\s*(\/\*\*|\*|\/\/)/.test(line) ? (
        <span className={tk.comment}>{line}</span>
      ) : (
        highlightSourceLine(line)
      )}
    </span>
  ))
}

function highlightSourceLine(line: string) {
  return [...line.matchAll(SOURCE_TOKEN)].map(match => {
    const [text, string, number, word, punct] = match
    const next = line[match.index + text.length]
    const className = string
      ? tk.string
      : number
        ? tk.type
        : word
          ? readWordClass(word, next)
          : punct
            ? tk.punct
            : undefined
    return className ? (
      <span key={match.index} className={className}>
        {text}
      </span>
    ) : (
      text
    )
  })
}

function readWordClass(word: string, next: string | undefined) {
  if (keywords.has(word)) return tk.keyword
  if (types.has(word)) return tk.type
  if (next === "(") return tk.func
  return undefined
}

const showcaseTerminal = `$ uptask build --help
USAGE uptask build [options] <target>

Build the project.

ARGUMENTS
  target                 Build target name

OPTIONS
  --watch                Enable watch mode (default: false)
  --concurrency <value>  Number of parallel builds (default: 4)
  -h, --help             display help for command

$ uptask build web --concurrency abc
error: invalid argument 'concurrency': expected number, received nan`

function TerminalSample(props: { text: string; className?: string }) {
  return (
    <pre
      className={cn(
        "p-5 text-sm leading-relaxed font-mono overflow-x-auto",
        props.className,
      )}
    >
      <code className={tk.body}>
        {props.text.split("\n").map((line, i) => (
          <span key={i}>
            {line.startsWith("$ ") ? highlightCommand(line) : highlightOutput(line)}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  )
}

const COMMAND_TOKEN = /(^\$)|('[^']*')|(--[\w-]+)|((?<=^\$ )\S+)|(\s+|\S+)/g

function highlightCommand(line: string) {
  return [...line.matchAll(COMMAND_TOKEN)].map(match => {
    const [text, prompt, string, flag, program] = match
    const className = prompt
      ? tk.prompt
      : string
        ? tk.string
        : flag
          ? tk.flag
          : program
            ? tk.func
            : undefined
    return className ? (
      <span key={match.index} className={className}>
        {text}
      </span>
    ) : (
      text
    )
  })
}

const OUTPUT_TOKEN =
  /(^[A-Z]{3,}\b)|(^error:)|(\(default: [^)]*\))|((?<![\w-])-{1,2}[A-Za-z][\w-]*)|('[^']*')|(\s+|[^\s'(-]+|[\s\S])/g

function highlightOutput(line: string) {
  return [...line.matchAll(OUTPUT_TOKEN)].map(match => {
    const [text, heading, error, fallback, flag, string] = match
    const className = heading
      ? tk.dim
      : error
        ? tk.prompt
        : fallback
          ? tk.dim
          : flag
            ? tk.flag
            : string
              ? tk.string
              : undefined
    return className ? (
      <span key={match.index} className={className}>
        {text}
      </span>
    ) : (
      text
    )
  })
}

function Bullet(props: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-primary/20 bg-card/60 p-4">
      <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-foreground/90 leading-relaxed">{props.text}</p>
    </div>
  )
}

function WindowCard(props: { label: string; children: ReactNode }) {
  return (
    <div className="h-full rounded-card border border-primary/20 bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2 bg-muted/50">
        <div className="size-2.5 rounded-full bg-red-400/60" />
        <div className="size-2.5 rounded-full bg-yellow-400/60" />
        <div className="size-2.5 rounded-full bg-green-400/60" />
        <span className="ml-2 text-xs font-mono text-muted-foreground">
          {props.label}
        </span>
      </div>
      {props.children}
    </div>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Stop writing CLI glue.{" "}
            <span className="text-primary">Just export a function.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Install, write a function, run it. That's the whole setup.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/$"
              params={{ _splat: "introduction" }}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "px-5 no-underline",
              )}
            >
              <BookOpen className="size-4" />
              Read the docs
            </Link>
            <Link
              to="/$"
              params={{ _splat: "configuration" }}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "px-5 no-underline",
              )}
            >
              See the config
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Datist() {
  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Built by
            </p>
            <a
              href="https://datist.io"
              target="_blank"
              rel="noopener"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors no-underline"
            >
              Datist — Software development, end to end.
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Reveal(props: { children: ReactNode; delayMs?: number }) {
  const { ref, isVisible } = useInView()
  return (
    <div
      ref={ref as (node: HTMLDivElement | null) => void}
      style={{ transitionDelay: `${props.delayMs ?? 0}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      {props.children}
    </div>
  )
}
