import { useParams, useViewport } from 'common'
import { AdvisorButton } from 'components/layouts/AppLayout/AdvisorButton'
import { AssistantButton } from 'components/layouts/AppLayout/AssistantButton'
import { InlineEditorButton } from 'components/layouts/AppLayout/InlineEditorButton'
import { SIDEBAR_KEYS } from 'components/layouts/ProjectLayout/LayoutSidebar/LayoutSidebarProvider'
import { HelpButton } from 'components/ui/HelpPanel/HelpButton'
import { AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useRef } from 'react'
import { Button, cn } from 'ui'

import { getNavbarStyle } from './FloatingMobileNavbar.utils'
import { useFloatingNavbarDrag } from './useFloatingNavbarDrag'
import { useFloatingNavbarNavSize } from './useFloatingNavbarNavSize'
import { useFloatingNavbarSheet } from './useFloatingNavbarSheet'
import { useFloatingNavbarSidebarClick } from './useFloatingNavbarSidebarClick'

const FloatingBottomNavbar = ({ hideMobileMenu }: { hideMobileMenu?: boolean }) => {
  const navRef = useRef<HTMLElement | null>(null)
  const sheet = useFloatingNavbarSheet(hideMobileMenu)
  const drag = useFloatingNavbarDrag(navRef)
  const handleNavClickCapture = useFloatingNavbarSidebarClick()
  const navSize = useFloatingNavbarNavSize(navRef, sheet.isSheetOpen)
  const viewport = useViewport()

  const style = getNavbarStyle({
    position: drag.position,
    navSize,
    isSheetOpen: sheet.isSheetOpen,
    viewport,
    isDragging: drag.dragStartRef.current !== null,
  })

  const { ref: projectRef } = useParams()

  return (
    <nav
      ref={navRef}
      aria-label="Floating navigation"
      className={cn(
        'flex pointer-events-auto cursor-grab active:cursor-grabbing flex-row items-centerw-auto',
        'gap-2',
        'fixed md:hidden'
      )}
      style={style}
      onClickCapture={handleNavClickCapture}
      onPointerDown={drag.handlePointerDown}
      onPointerMove={drag.handlePointerMove}
    >
      <div
        className={cn(
          'flex pointer-events-auto cursor-grab active:cursor-grabbing flex-row items-center justify-between w-auto rounded-full',
          'bg-overlay/80 backdrop-blur-md px-2.5 py-2 gap-2',
          'border border-strong shadow-[0px_3px_6px_-2px_rgba(0,0,0,0.07),0px_10px_30px_0px_rgba(0,0,0,0.10)]'
        )}
      >
        <AnimatePresence initial={false}>
          {!!projectRef && (
            <>
              <span data-sidebar-id={SIDEBAR_KEYS.AI_ASSISTANT}>
                <AssistantButton />
              </span>
              <span data-sidebar-id={SIDEBAR_KEYS.EDITOR_PANEL}>
                <InlineEditorButton />
              </span>
            </>
          )}
          <span data-sidebar-id={SIDEBAR_KEYS.ADVISOR_PANEL}>
            <AdvisorButton projectRef={projectRef} />
          </span>
          <HelpButton />
          {sheet.showMenuButton && (
            <Button
              title="Menu dropdown button"
              type={sheet.isMenuOpen ? 'secondary' : 'default'}
              className={cn(
                'flex lg:hidden mr-1 rounded-md min-w-[30px] w-[30px] h-[30px] data-[state=open]:bg-overlay-hover/30',
                !sheet.isMenuOpen && '!bg-surface-300'
              )}
              icon={<Menu />}
              onClick={sheet.handleMenuClick}
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        <Button
          title="close"
          type="text"
          className={cn(
            'flex flex-row items-center justify-center rounded-full',
            'bg-overlay/50 backdrop-blur-md my-auto !p-1 gap-2',
            'border border-strong shadow-[0px_3px_6px_-2px_rgba(0,0,0,0.07),0px_10px_30px_0px_rgba(0,0,0,0.10)]',
            '!w-10 !h-10 !min-w-10 !min-h-10',
            'rounded-full',
            !sheet.isSheetOpen && 'hidden'
          )}
          icon={<X />}
          onClick={sheet.handleClose}
        />
      </AnimatePresence>
    </nav>
  )
}

export default FloatingBottomNavbar
