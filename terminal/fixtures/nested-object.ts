/**
 * Configure nested settings
 * @param opts Options
 * @param opts.outer Outer group
 * @param opts.outer.inner Enable inner feature
 * @param opts.label Optional label
 */
export function setup(opts: { outer: { inner: boolean }; label?: string }) {
  return opts
}
