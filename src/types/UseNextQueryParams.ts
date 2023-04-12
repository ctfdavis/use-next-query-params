export type UseNextQueryParamsReturn = {
    /**
     * isStable is true once the query params and query param states have been fully initialized.
     * This could be useful for blocking certain actions until the query params have been initialized.
     */
    isStable: boolean;
};
