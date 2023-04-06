/**
 * Determines how query params are updated during navigation within the same page component.
 * @default 'default'
 * @remarks
 * - 'default' - Updates query params to match the link's target query params, but retains
 *   any unspecified states' current values.
 * - 'reset' - Updates query params to match the link's target query params, and resets
 *   any unspecified states to their initial values, reflecting these changes in the query params.
 * - 'merge' - Updates query params to match the link's target query params, and then
 *   merges any unspecified states with their current values in the target query params.
 */
export type NextQueryParamsAdapterMode = 'default' | 'reset' | 'merge';
