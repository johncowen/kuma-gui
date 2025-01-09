import Kongponents, { KTooltip, KCard, KPop, KInputSwitch, KCheckbox, KRadio } from '@kong/kongponents'

import XAboutCard from './components/x-about-card/XAboutCard.vue'
import XAction from './components/x-action/XAction.vue'
import XActionGroup from './components/x-action-group/XActionGroup.vue'
import XAlert from './components/x-alert/XAlert.vue'
import XBadge from './components/x-badge/XBadge.vue'
import XBreadcrumbs from './components/x-breadcrumbs/XBreadcrumbs.vue'
import XCodeBlock from './components/x-code-block/XCodeBlock.vue'
import XCopyButton from './components/x-copy-button/XCopyButton.vue'
import XDisclosure from './components/x-disclosure/XDisclosure.vue'
import XEmptyState from './components/x-empty-state/XEmptyState.vue'
import XI18n from './components/x-i18n/XI18n.vue'
import XIcon from './components/x-icon/XIcon.vue'
import XInput from './components/x-input/XInput.vue'
import XLayout from './components/x-layout/XLayout.vue'
import XModal from './components/x-modal/XModal.vue'
import XProgress from './components/x-progress/XProgress.vue'
import XPrompt from './components/x-prompt/XPrompt.vue'
import XProvider from './components/x-provider/XProvider.vue'
import XSelect from './components/x-select/XSelect.vue'
import XTabs from './components/x-tabs/XTabs.vue'
import XTeleportSlot from './components/x-teleport/XTeleportSlot.vue'
import XTeleportTemplate from './components/x-teleport/XTeleportTemplate.vue'
import locales from './locales/en-us/index.yaml'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

declare module 'vue' {
  export interface GlobalComponents {
    XCard: typeof KCard
    XPop: typeof KPop
    XInputSwitch: typeof KInputSwitch
    XCheckbox: typeof KCheckbox
    XRadio: typeof KRadio
    XTooltip: typeof KTooltip
    //
    XAlert: typeof XAlert
    XIcon: typeof XIcon
    XI18n: typeof XI18n
    XInput: typeof XInput
    XAction: typeof XAction
    XActionGroup: typeof XActionGroup
    XBadge: typeof XBadge
    XCopyButton: typeof XCopyButton
    XCodeBlock: typeof XCodeBlock
    XBreadcrumbs: typeof XBreadcrumbs
    XEmptyState: typeof XEmptyState
    XLayout: typeof XLayout
    XModal: typeof XModal
    XPrompt: typeof XPrompt
    XProvider: typeof XProvider
    XProgress: typeof XProgress
    XSelect: typeof XSelect
    XTabs: typeof XTabs
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XDisclosure: typeof XDisclosure
    XAboutCard: typeof XAboutCard
  }
}

const $ = {
  xVueComponents: token('x.vue.components'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('kong.plugins'), {
      service: () => {
        return [
          [Kongponents],
        ]
      },
      labels: [
        app.plugins,
      ],
    }],

    [$.xVueComponents, {
      service: () => {
        return [
          ['XAlert', XAlert],
          ['XCard', KCard],
          ['XPop', KPop],
          ['XInputSwitch', KInputSwitch],
          ['XCheckbox', KCheckbox],
          ['XRadio', KRadio],
          ['XTooltip', KTooltip],
          //
          ['XAction', XAction],
          ['XActionGroup', XActionGroup],
          ['XBadge', XBadge],
          ['XBreadcrumbs', XBreadcrumbs],
          ['XCopyButton', XCopyButton],
          ['XCodeBlock', XCodeBlock],
          ['XEmptyState', XEmptyState],
          ['XIcon', XIcon],
          ['XI18n', XI18n],
          ['XInput', XInput],
          ['XLayout', XLayout],
          ['XModal', XModal],
          ['XPrompt', XPrompt],
          ['XProvider', XProvider],
          ['XProgress', XProgress],
          ['XSelect', XSelect],
          ['XTabs', XTabs],
          ['XTeleportTemplate', XTeleportTemplate],
          ['XTeleportSlot', XTeleportSlot],
          ['XDisclosure', XDisclosure],
          ['XAboutCard', XAboutCard],
        ]
      },
      labels: [
        app.components,
      ],
    }],
    [token('x.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
export const TOKENS = $