import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useSidebarManagerSnapshot } from 'state/sidebar-manager-state'

import { useMobileSheet } from '../NavigationBar/MobileSheetContext'

import { isMenuContent, shouldShowMenuButton } from './FloatingMobileNavbar.utils'

export function useFloatingNavbarSheet(hideMobileMenu?: boolean) {
  const router = useRouter()
  const pathname = router.asPath?.split('?')[0] ?? router.pathname
  const { content: sheetContent, setContent: setSheetContent, openMenu } = useMobileSheet()
  const { clearActiveSidebar } = useSidebarManagerSnapshot()

  const isSheetOpen = sheetContent !== null
  const isMenuOpen = isMenuContent(sheetContent)
  const showMenuButton = shouldShowMenuButton(pathname) && !hideMobileMenu

  const handleMenuClick = useCallback(() => {
    clearActiveSidebar()
    openMenu()
  }, [clearActiveSidebar, openMenu])

  const handleClose = useCallback(() => {
    clearActiveSidebar()
    setSheetContent(null)
  }, [clearActiveSidebar, setSheetContent])

  return {
    isSheetOpen,
    isMenuOpen,
    showMenuButton,
    handleMenuClick,
    handleClose,
  }
}
