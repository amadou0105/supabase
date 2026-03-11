import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useSidebarManagerSnapshot } from 'state/sidebar-manager-state'

import { useMobileSheet } from '../NavigationBar/MobileSheetContext'
import { isMenuContent, shouldShowMenuButton } from './FloatingMobileNavbar.utils'

export function useFloatingNavbarSheet(hideMobileMenu?: boolean) {
  const router = useRouter()
  const pathname = router.asPath?.split('?')[0] ?? router.pathname
  const { content: sheetContent, setContent: setSheetContent, openMenu } = useMobileSheet()
  const { clearActiveSidebar, closeActive, activeSidebar } = useSidebarManagerSnapshot()

  const isSheetOpen = sheetContent !== null
  const isMenuOpen = isMenuContent(sheetContent)
  const showMenuButton = shouldShowMenuButton(pathname) && !hideMobileMenu

  const handleMenuClick = useCallback(() => {
    if (isMenuOpen) {
      clearActiveSidebar()
      setSheetContent(null)
      return
    }
    clearActiveSidebar()
    openMenu()
  }, [isMenuOpen, clearActiveSidebar, openMenu, setSheetContent])

  const handleClose = useCallback(() => {
    if (activeSidebar) {
      closeActive()
    } else {
      setSheetContent(null)
    }
  }, [activeSidebar, closeActive, setSheetContent])

  return {
    isSheetOpen,
    isMenuOpen,
    showMenuButton,
    handleMenuClick,
    handleClose,
  }
}
