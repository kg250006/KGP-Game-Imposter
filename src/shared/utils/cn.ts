/**
 * @fileoverview Utility function for merging className strings
 *
 * A simple utility for combining Tailwind CSS classes with conditional logic.
 * Handles undefined, null, and false values gracefully.
 *
 * @module utils/cn
 */

/**
 * Combines multiple className strings into a single string.
 * Filters out falsy values for conditional classes.
 *
 * @param classes - Variable number of className strings or conditional values
 * @returns Combined className string with falsy values removed
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('btn', 'btn-primary') // => 'btn btn-primary'
 *
 * // With conditional classes
 * cn('btn', isActive && 'active') // => 'btn active' (if isActive is true)
 * cn('btn', isActive && 'active') // => 'btn' (if isActive is false)
 *
 * // With undefined/null
 * cn('btn', undefined, 'text-lg') // => 'btn text-lg'
 * ```
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
