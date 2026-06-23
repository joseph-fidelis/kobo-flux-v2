// lib/helpers/list.ts

/**
 * Replaces an item in a list by matching on `id`.
 * Mutates the array in place — returns the updated array.
 *
 * Usage:
 *   updateItemInList(_data.value.items, updatedFirearm)
 */
export function updateItemInList<T extends { id: string }>(
  items: T[] | undefined | null,   
  updated: T,
): T[] {
  if (!items) return []
  const index = items.findIndex(item => item.id === updated.id)
  if (index !== -1) {
    items[index] = updated
  }
  return items
}
/**
 * Removes an item from a list by id.
 * Usage:
 *   removeItemFromList(_data.value.items, updatedFirearm)
 */

export function removeItemFromList<T extends { id: string }>(
  items: T[] | undefined | null,   
  id: string,
): T[] {
  if (!items) return []            
  const index = items.findIndex(item => item.id === id)
  if (index > -1) {
    items.splice(index, 1)
  }
  return items
}
/**
 * Adds an item to the top of a list.
 * Usage:
 *   prependItemToList(_data.value.items, updatedFirearm)
 */
export function prependItemToList<T>(
  items: T[] | undefined | null,   
  item: T,
): T[] {
  if (!items) return [item]
  items.unshift(item)
  return items
}