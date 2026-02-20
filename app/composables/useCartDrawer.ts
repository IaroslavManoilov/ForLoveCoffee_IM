// composables/useCartDrawer.ts
export function useCartDrawer() {
  const open = useState<boolean>("cartDrawerOpen", () => false)

  const openDrawer = () => (open.value = true)
  const closeDrawer = () => (open.value = false)
  const toggleDrawer = () => (open.value = !open.value)

  return { open, openDrawer, closeDrawer, toggleDrawer }
}