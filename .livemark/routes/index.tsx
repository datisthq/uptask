import { Link, createFileRoute } from "@tanstack/react-router"
import {
  ArrowRight,
  FileCode2,
  FolderTree,
  Github,
  Layers,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { buttonVariants } from "livemark/elements/button"
import { useInView } from "livemark/hooks/in-view"
import { cn } from "livemark/utils/style"

export const Route = createFileRoute("/")({
  component: Landing,
})

function Landing() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Showcase />
      <FinalCta />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border flex items-center min-h-[calc(100vh-4rem)]">
      <BackgroundGrid />
      <div className="relative w-full mx-auto max-w-5xl px-6 py-16 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
          TypeScript functions,{" "}
          <span className="relative inline-block">
            <span className="relative z-10">ready for the CLI</span>
            <span
              aria-hidden
              className="absolute left-0 right-0 bottom-1 md:bottom-2 h-3 md:h-4 bg-primary/20 -z-0 rounded"
            />
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Point uptask at a glob. Every function exported from a matching file
          becomes a CLI command.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/introduction/"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "px-5 no-underline",
            )}
          >
            Get started
            <ArrowRight className="size-4" />
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

        <div className="mt-10 inline-flex items-center gap-3 rounded-lg border border-border bg-card/50 backdrop-blur px-4 py-2.5 font-mono text-sm text-muted-foreground">
          <span className="text-primary select-none">$</span>
          <span>
            <span className="text-foreground">pnpm add -D</span> uptask
          </span>
        </div>
      </div>
    </section>
  )
}

function BackgroundGrid() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 [background-image:repeating-linear-gradient(90deg,var(--color-border)_0,var(--color-border)_1px,transparent_1px,transparent_8px)] opacity-25 [mask-image:linear-gradient(to_top,black_10%,transparent_85%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-blue-400/30 dark:bg-blue-500/25 blur-[110px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-fuchsia-400/25 dark:bg-fuchsia-500/20 blur-[110px] pointer-events-none"
      />
    </>
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
      "Plain exported functions become commands. JSDoc descriptions surface in --help.",
  },
  {
    icon: FileCode2,
    title: "Type-driven CLI",
    description:
      "Argument types come straight from TypeScript. Defaults, optionality, and nested objects map themselves.",
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
    icon: Layers,
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
              Sensible defaults, no setup to start, fully customizable when you
              need it.
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

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="h-full group relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
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
}

function SourceSample() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>
        <span className={tk.comment}>{"// @build.ts"}</span>
        {"\n"}
        <span className={tk.comment}>{"/**"}</span>
        {"\n"}
        <span className={tk.comment}>{" * Build the project."}</span>
        {"\n"}
        <span className={tk.comment}>{" *"}</span>
        {"\n"}
        <span className={tk.comment}>
          {" * @param target Build target name"}
        </span>
        {"\n"}
        <span className={tk.comment}>
          {" * @param watch Enable watch mode"}
        </span>
        {"\n"}
        <span className={tk.comment}>{" */"}</span>
        {"\n"}
        <span className={tk.keyword}>export function</span>{" "}
        <span className={tk.func}>build</span>
        <span className={tk.punct}>{"("}</span>
        {"\n  "}
        target<span className={tk.punct}>:</span>{" "}
        <span className={tk.type}>string</span>
        <span className={tk.punct}>,</span>
        {"\n  "}
        watch<span className={tk.punct}>:</span>{" "}
        <span className={tk.type}>boolean</span>{" "}
        <span className={tk.punct}>=</span>{" "}
        <span className={tk.keyword}>false</span>
        <span className={tk.punct}>,</span>
        {"\n"}
        <span className={tk.punct}>{") {"}</span>
        {"\n  "}
        console<span className={tk.punct}>.</span>
        <span className={tk.func}>log</span>
        <span className={tk.punct}>{"({ "}</span>target
        <span className={tk.punct}>,</span> watch
        <span className={tk.punct}>{" })"}</span>
        {"\n"}
        <span className={tk.punct}>{"}"}</span>
      </code>
    </pre>
  )
}

function HelpSample() {
  return (
    <pre className="p-5 text-sm leading-relaxed font-mono overflow-x-auto">
      <code className={tk.body}>
        <span className={tk.prompt}>$</span>{" "}
        <span className={tk.func}>uptask</span> build{" "}
        <span className={tk.flag}>--help</span>
        {"\n"}
        <span className={tk.dim}>USAGE</span> uptask build{" "}
        <span className={tk.punct}>{"[options]"}</span>{" "}
        <span className={tk.punct}>{"<target>"}</span>
        {"\n\n"}
        Build the project.
        {"\n\n"}
        <span className={tk.dim}>ARGUMENTS</span>
        {"\n  "}target{"          "}
        <span className={tk.body}>Build target name</span>
        {"\n\n"}
        <span className={tk.dim}>OPTIONS</span>
        {"\n  "}
        <span className={tk.flag}>--watch</span>
        {"         "}Enable watch mode
        {"\n  "}
        <span className={tk.flag}>-h, --help</span>
        {"      "}display help for command
      </code>
    </pre>
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
              Your <code className="font-mono">.ts</code> files stay as they are
              — uptask does the rest.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2 bg-muted/50">
                <div className="size-2.5 rounded-full bg-red-400/60" />
                <div className="size-2.5 rounded-full bg-yellow-400/60" />
                <div className="size-2.5 rounded-full bg-green-400/60" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  @build.ts
                </span>
              </div>
              <SourceSample />
            </div>
            <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-primary/20 px-4 py-2 bg-muted/50">
                <div className="size-2.5 rounded-full bg-red-400/60" />
                <div className="size-2.5 rounded-full bg-yellow-400/60" />
                <div className="size-2.5 rounded-full bg-green-400/60" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  uptask --help
                </span>
              </div>
              <HelpSample />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
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
              to="/introduction/"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "px-5 no-underline",
              )}
            >
              Read the docs
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/configuration/"
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
