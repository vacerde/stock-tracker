import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const supabase = createClientComponentClient()

// Watchlist functions
export async function addToWatchlist(symbol: string) {
  const { data, error } = await supabase.from("watchlist").insert({ symbol }).select()

  if (error) throw error
  return data
}

export async function removeFromWatchlist(symbol: string) {
  const { error } = await supabase.from("watchlist").delete().eq("symbol", symbol)

  if (error) throw error
}

export async function getWatchlist() {
  const { data, error } = await supabase.from("watchlist").select("*").order("added_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function isInWatchlist(symbol: string) {
  const { data, error } = await supabase.from("watchlist").select("id").eq("symbol", symbol).single()

  if (error && error.code !== "PGRST116") throw error
  return !!data
}

// Holdings functions
export async function addHolding(symbol: string, quantity: number, purchasePrice: number, notes?: string) {
  const { data, error } = await supabase
    .from("holdings")
    .insert({
      symbol,
      quantity,
      purchase_price: purchasePrice,
      notes,
    })
    .select()

  if (error) throw error
  return data
}

export async function getHoldings() {
  const { data, error } = await supabase.from("holdings").select("*").order("purchase_date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateHolding(
  id: string,
  updates: Partial<{ quantity: number; purchase_price: number; notes: string }>,
) {
  const { data, error } = await supabase.from("holdings").update(updates).eq("id", id).select()

  if (error) throw error
  return data
}

export async function deleteHolding(id: string) {
  const { error } = await supabase.from("holdings").delete().eq("id", id)

  if (error) throw error
}

// Alerts functions
export async function createAlert(symbol: string, alertType: "above" | "below", targetPrice: number) {
  const { data, error } = await supabase
    .from("alerts")
    .insert({
      symbol,
      alert_type: alertType,
      target_price: targetPrice,
    })
    .select()

  if (error) throw error
  return data
}

export async function getAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Chart annotations functions
export async function saveChartAnnotation(symbol: string, annotationType: string, annotationData: any) {
  const { data, error } = await supabase
    .from("chart_annotations")
    .insert({
      symbol,
      annotation_type: annotationType,
      data: annotationData,
    })
    .select()

  if (error) throw error
  return data
}

export async function getChartAnnotations(symbol: string) {
  const { data, error } = await supabase.from("chart_annotations").select("*").eq("symbol", symbol)

  if (error) throw error
  return data || []
}
