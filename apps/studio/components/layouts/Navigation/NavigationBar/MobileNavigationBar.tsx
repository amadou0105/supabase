import { useParams } from 'common'
import { useIsFloatingMobileNavbarEnabled } from 'components/interfaces/App/FeaturePreview/FeaturePreviewContext'
import { ConnectButton } from 'components/interfaces/ConnectButton/ConnectButton'
import { SidebarContent } from 'components/interfaces/Sidebar'
import { UserDropdown } from 'components/interfaces/UserDropdown'
import FloatingMobileNavbar from 'components/layouts/Navigation/FloatingMobileNavbar/FloatingMobileNavbar'
import { useSelectedOrganizationQuery } from 'hooks/misc/useSelectedOrganization'
import { IS_PLATFORM } from 'lib/constants'
import { Menu, Search } from 'lucide-react'
import { Button, cn } from 'ui'
import { CommandMenuTrigger } from 'ui-patterns'

import { LocalDropdown } from '../../../interfaces/LocalDropdown'
import { UserDropdown } from '../../../interfaces/UserDropdown'
import { HomeIcon } from '../LayoutHeader/HomeIcon'
import { useMobileSheet } from './MobileSheetContext'
import { OrgSelector } from './OrgSelector'
import { ProjectBranchSelector } from './ProjectBranchSelector'

export const ICON_SIZE = 20
export const ICON_STROKE_WIDTH = 1.5

const MobileNavigationBar = ({ hideMobileMenu }: { hideMobileMenu?: boolean }) => {
  const router = useRouter()
  const showFloatingMobileNavbar = useIsFloatingMobileNavbarEnabled()
  const { ref: projectRef, slug } = useParams()
  const { data: selectedOrganization } = useSelectedOrganizationQuery()
  const isProjectScope = !!projectRef
  const showOrgSelection = slug || (selectedOrganization && projectRef)
  const { openMenu } = useMobileSheet()

  return (
    <div className="w-full flex flex-row md:hidden">
      <nav
        className={cn(
          'group pr-3 pl-2 z-10 w-full h-12 gap-2',
          'border-b bg-dash-sidebar border-default shadow-xl',
          'transition-width duration-200',
          'hide-scrollbar flex flex-row items-center justify-between overflow-x-auto'
        )}
      >
        <div className={cn('flex min-w-0 flex-shrink items-center gap-2', !IS_PLATFORM && 'pl-2')}>
          {!IS_PLATFORM && <HomeIcon />}
          {isProjectScope ? (
            <>
              <ProjectBranchSelector />
              <ConnectButton className="[&_span]:hidden h-8 w-8" />
            </>
          ) : IS_PLATFORM && showOrgSelection ? (
            <OrgSelector />
          ) : (
            <HomeIcon className="ml-1" />
          )}
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <CommandMenuTrigger>
            <button
              type="button"
              className={cn(
                'group',
                'flex-grow h-[30px] rounded-md',
                'p-2',
                'flex items-center justify-between',
                'bg-transparent border-none text-foreground-lighter',
                'hover:bg-opacity-100 hover:border-strong hover:text-foreground-light',
                'focus-visible:!outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600',
                'transition'
              )}
            >
              <Search size={18} strokeWidth={2} />
            </button>
          </CommandMenuTrigger>
          <UserDropdown />
          {!hideMobileMenu && !showFloatingMobileNavbar && (
            <Button
              title="Menu dropdown button"
              type="default"
              className="flex lg:hidden border-default bg-surface-100/75 text-foreground-light rounded-md min-w-[30px] w-[30px] h-[30px] data-[state=open]:bg-overlay-hover/30"
              icon={<Menu />}
              onClick={() => openMenu()}
            />
          )}
          {showFloatingMobileNavbar && (IS_PLATFORM ? <UserDropdown /> : <LocalDropdown />)}
        </div>
      </nav>
      {showFloatingMobileNavbar && <FloatingMobileNavbar hideMobileMenu={hideMobileMenu} />}
    </div>
  )
}

export default MobileNavigationBar
