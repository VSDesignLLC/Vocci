# Vocci — Cinematic Context, 14 September 2026

Preserved baseline: https://vocci-longshot-option3.jiayuanw95.chatgpt.site
Baseline commit: bb2f3dc694f06a13e7319d3f77ab32794cb603c5
This is an independent site and source repository.

## Scope
Hero and sections 3–6 retain baseline markup, assets and internal interactions. New scroll entrance layer scales each lower section from 92% to 100%, with a slight translation and focus transition. Existing product accordion, finish selector, manufacturing carousel and story hover effects remain.

Highlights replaces the previous line-art narrative with three consistent Alex photographic compositions: client discussion, hotel work, airport transfer. Isolated dark images are screen-blended into the stage; files are RGB, not alpha assets. Orange square corners and fine leaders follow the ring. Scroll controls continuous zoom, depth blur, image crossfade and narrative states. Reduced-motion preferences disable zoom and blur.

## Narrative
Source: 0914 用户小传与事件设定 .docx. Alex is a project manager coordinating a product launch. Friday proposal and venue constraints carry across scenes. Connect your AI uses synced meeting context to organize department actions in ChatGPT, retaining open questions. Ask Vocci AI is a separate route: Alex holds the ring to request a Slack message to Maya about transport dimensions and setup time. App review and send are local design demonstrations, without external messaging.

## References
09/08 Option A: https://vocci-demos.vercel.app/ (embedded source https://vocci-option-one-trust.lqc0304.chatgpt.site/)
Mira focus/blur, corner pixels and line work: https://trymira.com/

## Validation
Browser review at desktop and 390px mobile frame. Verified scene navigation, independent path shortcuts, review modal, simulated send, source asset references, unchanged Hero/lower section markup. Black primary CTAs retained; orange reserved for AI/focus/progress accents.

## Revision 2
Removed the duplicate top navigation, non-document taglines, technical captions, illustrative footer label and invented AI replies/action-list content. A single bottom story navigation now uses action labels. Copy and App are laid out in one flex column, with dedicated footer space and a short-screen overflow fallback. The sticky stage uses overflow:clip to prevent hidden-container scroll offsets. Photography uses a ring-centered crop with partial face framing.

Original Figma source components were decoded to SVG: Top Menu 311:78709, Input Box 311:78758, AI Mark 311:78726. The SVGs retain original geometry and source styling; unused input modes are hidden for the displayed state. Conversation wording is from the provided Alex scenario; Review/Send remains an illustrative interaction.

Responsive QA: 1440×900, 1280×720, 1024×600, 390×844. Measured copy-to-UI gaps 20–27px, no component overlap, one story navigation row, no page horizontal overflow. Hero and all sections after Highlights are byte-for-byte unchanged from version 1.
