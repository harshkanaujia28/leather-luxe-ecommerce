import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import {
  mockProducts,
  mockCategories,
  mockUsers,
  getFeaturedProducts,
  getProductBySlug,
  getCategoryBySlug,
  authenticateUser,
  createUser,
} from "./mock-data"

// Treat "", "undefined", "null" as NOT set
const isValidEnv = (v?: string) => v && v !== "undefined" && v !== "null" && v.trim() !== ""

const useMockData =
  !isValidEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || !isValidEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const supabaseUrl = isValidEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) ? process.env.NEXT_PUBLIC_SUPABASE_URL! : undefined
const supabaseAnonKey = isValidEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  : undefined
const serviceKey = isValidEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? process.env.SUPABASE_SERVICE_ROLE_KEY!
  : undefined

// ---------------------------------------------------------------------------
// Mock Supabase client that uses frontend data
// ---------------------------------------------------------------------------
function createMockClient(): SupabaseClient {
  let currentUser: any = null

  const mockQuery = (tableName: string) => {
    const chainMethods = {
      select: (columns = "*") => chainMethods,
      eq: (column: string, value: any) => {
        if (tableName === "products" && column === "featured") {
          return {
            ...chainMethods,
            limit: (n: number) => Promise.resolve({ data: getFeaturedProducts().slice(0, n), error: null }),
          }
        }
        if (tableName === "products" && column === "category_id") {
          const category = mockCategories.find((cat) => cat.id === value)
          const products = mockProducts.filter((p) => p.category_id === value)
          return {
            ...chainMethods,
            single: () =>
              Promise.resolve({ data: products[0] || null, error: products[0] ? null : new Error("Not found") }),
            order: () => chainMethods,
            range: (start: number, end: number) =>
              Promise.resolve({
                data: products.slice(start, end + 1),
                error: null,
              }),
          }
        }
        if (tableName === "products" && column === "slug") {
          const product = getProductBySlug(value)
          return {
            ...chainMethods,
            single: () => Promise.resolve({ data: product, error: product ? null : new Error("Not found") }),
          }
        }
        if (tableName === "categories" && column === "slug") {
          const category = getCategoryBySlug(value)
          return {
            ...chainMethods,
            single: () => Promise.resolve({ data: category, error: category ? null : new Error("Not found") }),
          }
        }
        if (tableName === "users" && column === "id") {
          const user = mockUsers.find((u) => u.id === value)
          return {
            ...chainMethods,
            single: () => Promise.resolve({ data: user || null, error: user ? null : new Error("Not found") }),
          }
        }
        return chainMethods
      },
      order: (column: string, options?: any) => chainMethods,
      limit: (n: number) => {
        if (tableName === "products") {
          return Promise.resolve({ data: mockProducts.slice(0, n), error: null })
        }
        if (tableName === "categories") {
          return Promise.resolve({ data: mockCategories.slice(0, n), error: null })
        }
        return Promise.resolve({ data: [], error: null })
      },
      range: (start: number, end: number) => {
        if (tableName === "products") {
          return Promise.resolve({ data: mockProducts.slice(start, end + 1), error: null })
        }
        return Promise.resolve({ data: [], error: null })
      },
      single: () => {
        if (tableName === "products") {
          return Promise.resolve({ data: mockProducts[0] || null, error: null })
        }
        return Promise.resolve({ data: null, error: new Error("Not found") })
      },
      insert: (data: any) => Promise.resolve({ data, error: null }),
      update: (data: any) => Promise.resolve({ data, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback),
      catch: (callback: any) => Promise.resolve({ data: [], error: null }).catch(callback),
    }

    // Handle count queries
    if (tableName === "products") {
      return {
        ...chainMethods,
        select: (columns: string, options?: any) => {
          if (options?.count === "exact" && options?.head) {
            return Promise.resolve({ count: mockProducts.length, error: null })
          }
          return chainMethods
        },
      }
    }

    return chainMethods
  }

  return {
    from: (tableName: string) => mockQuery(tableName),
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const user = authenticateUser(email, password)
        if (user) {
          currentUser = user
          return { data: { user }, error: null }
        }
        return { data: null, error: new Error("Invalid credentials") }
      },
      signUp: async ({ email, password, options }: any) => {
        const firstName = options?.data?.first_name || ""
        const lastName = options?.data?.last_name || ""
        const user = createUser(email, password, firstName, lastName)
        currentUser = user
        return { data: { user }, error: null }
      },
      signOut: async () => {
        currentUser = null
        return { error: null }
      },
      getUser: async () => ({ data: { user: currentUser } }),
      getSession: async () => ({ data: { session: currentUser ? { user: currentUser } : null } }),
      onAuthStateChange: (callback: any) => {
        // Simulate auth state change
        setTimeout(() => {
          if (currentUser) {
            callback("SIGNED_IN", { user: currentUser })
          } else {
            callback("SIGNED_OUT", null)
          }
        }, 100)
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
  } as unknown as SupabaseClient
}

// ---------------------------------------------------------------------------
// Helper: create a minimal chain-safe Supabase client stub for real errors
// ---------------------------------------------------------------------------
function createStubClient(): SupabaseClient {
  type QueryResult = Promise<{ data: any; error: Error }>
  const fakeResult: QueryResult = Promise.resolve({ data: [], error: new Error("Supabase not configured") })

  const builder = {} as any
  const chain = () => builder

  // chainable methods
  builder.select = (_args: any) => chain()
  builder.eq = (_c: any, _v: any) => chain()
  builder.limit = (_n: number) => fakeResult
  builder.single = () => fakeResult
  builder.order = (_c: string, _opts?: any) => chain()
  builder.insert = (_v: any) => fakeResult
  builder.update = (_v: any) => fakeResult
  builder.delete = () => fakeResult
  builder.range = (_start: number, _end: number) => fakeResult

  builder.then = fakeResult.then.bind(fakeResult)
  builder.catch = fakeResult.catch.bind(fakeResult)

  return {
    from() {
      return builder
    },
    auth: {
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: new Error("Supabase not configured") }),
      getUser: async () => ({ data: { user: null } }),
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  } as unknown as SupabaseClient
}

// ---------------------------------------------------------------------------
// Client-side Supabase instance
// ---------------------------------------------------------------------------
export const supabase: SupabaseClient = useMockData
  ? createMockClient()
  : supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createStubClient()

// ---------------------------------------------------------------------------
// Server-side helper
// ---------------------------------------------------------------------------
export const createServerClient = (): SupabaseClient =>
  useMockData
    ? createMockClient()
    : supabaseUrl && serviceKey
      ? createClient(supabaseUrl, serviceKey)
      : createStubClient()
