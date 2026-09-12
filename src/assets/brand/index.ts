/**
 * rlayAi brand assets.
 *
 * Imported through Vite so each file is content-hashed and cache-busted.
 * The walkthrough videos are deliberately not used, and the full-size avatar
 * JPEGs are skipped in favour of the circular crops.
 */

// Wordmark for light backgrounds (Midnight Navy type + Orion Blue "Ai")
import logoFullDark from './logo/logo_full_dark.png';
// Wordmark for dark backgrounds (white type + Euphoria Blue "Ai")
import logoFullLight from './logo/logo_full_light.png';
import logoIcon from './logo/logo_icon.png';
import logoAppIcon from './logo/logo_app_icon.png';
import logoMonochromeWhite from './logo/logo_monochrome_white.png';

import botAvatar from './avatars/bot_avatar_circle.png';
import agentSarah from './avatars/agent_sarah_circle.png';
import agentDavid from './avatars/agent_david_circle.png';
import agentElena from './avatars/agent_elena_circle.png';
import agentMarcus from './avatars/agent_marcus_circle.png';

import deptBilling from './illustrations/dept_billing.svg';
import deptTechnical from './illustrations/dept_technical.svg';
import deptSuccess from './illustrations/dept_success.svg';
import deptGeneral from './illustrations/dept_general.svg';
import emptyInbox from './illustrations/empty_inbox_zero.svg';
import emptyKnowledgeBase from './illustrations/empty_knowledge_base.svg';

import supportRepWorkspace from './lifestyle/support_rep_workspace.jpg';
import teamCollaboration from './lifestyle/team_collaboration.jpg';


export const logo = {
  full: logoFullDark,
  fullOnDark: logoFullLight,
  icon: logoIcon,
  appIcon: logoAppIcon,
  monochromeWhite: logoMonochromeWhite,
};

export const avatars = {
  bot: botAvatar,
  sarah: agentSarah,
  david: agentDavid,
  elena: agentElena,
  marcus: agentMarcus,
};

export const illustrations = {
  deptBilling,
  deptTechnical,
  deptSuccess,
  deptGeneral,
  emptyInbox,
  emptyKnowledgeBase,
};

export const lifestyle = {
  supportRepWorkspace,
  teamCollaboration,
};
