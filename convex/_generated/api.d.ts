/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as audit from "../audit.js";
import type * as auth from "../auth.js";
import type * as certificates from "../certificates.js";
import type * as contact from "../contact.js";
import type * as events from "../events.js";
import type * as examinations from "../examinations.js";
import type * as helpers from "../helpers.js";
import type * as news from "../news.js";
import type * as publicResults from "../publicResults.js";
import type * as results from "../results.js";
import type * as schools from "../schools.js";
import type * as statistics from "../statistics.js";
import type * as students from "../students.js";
import type * as userFunctions from "../userFunctions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  audit: typeof audit;
  auth: typeof auth;
  certificates: typeof certificates;
  contact: typeof contact;
  events: typeof events;
  examinations: typeof examinations;
  helpers: typeof helpers;
  news: typeof news;
  publicResults: typeof publicResults;
  results: typeof results;
  schools: typeof schools;
  statistics: typeof statistics;
  students: typeof students;
  userFunctions: typeof userFunctions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
