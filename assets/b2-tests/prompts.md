# Image prompts and provenance

Built-in image_gen used for the single highlight style sample. Original user screenshots were used for the final ring cutouts, after explicit authorization to use local masks. Generated cutout attempts returned opaque checkerboards, failed alpha validation, and were discarded from project use.

## Highlight / handshake v1

Use case: photorealistic-natural.
Asset type: ONE landscape 16:9 editorial lifestyle photograph, for a full-viewport Vocci smart ring website highlight.
Input 1 is a STYLE reference only: neutral-cool editorial photography, generous pale negative space, fine grain, sharp focus isolated in a rectilinear window against soft defocus. Do not copy its eyewear, logo, text, collage or people. Input 2 is PRODUCT geometry reference: polished silver Vocci ring, flat wide band, single oval physical button and fine circumferential groove.
Scene: two adult professionals meeting in an airy minimal off-white studio office, in a candid handshake across a simple pale table. Show enough of both people (cropped torsos, natural shoulder silhouettes, partial faces) to communicate a real business encounter rather than detached hands. One holds a thin unbranded notebook in their free hand. Understated charcoal and light gray clothing. Natural believable hand anatomy. The near professional wears exactly one Vocci silver ring on their index finger, visible during the handshake; its button and geometry should closely match reference.
Composition: landscape, subjects mostly left and upper-middle, the joined hands and ring around x46%, y53%. A large calm almost-white area in the bottom right (x65-95%, y66-94%) for a large dark headline later. Background simple, no office clutter.
Treatment: sharply detailed ring-bearing hand and nearby cuff within an approximately rectangular focal area spanning x28-61%, y37-70%. Outside this region introduce soft cinematic optical defocus, while still reading as a single continuous scene, not separate photos; transition should feel intentional editorial. Add only two very fine off-white or pale-gray rectangular hairline outlines aligned with the focus area and one subtle extended horizontal construction line. No crosshair plus signs. Controlled subtle photographic grain, cold silver / gray / off-white, natural muted skin, soft daylight.
No text, no logos, no watermark, no UI, no duplicated hands, no science-fiction graphics. Create ONE image, not options.

Output: `highlight-handshake-v1.png`. Style proof only: ring depiction is not yet product accurate.

## Rejected imagegen extraction prompt

Use case: background-extraction. Edit target: the supplied Vocci product screenshot. Remove ONLY the background, supporting surface, cast shadow, and any mirrored reflection below the ring. Preserve the single actual ring itself precisely: original viewing angle, outer silhouette, inner metal walls, oval button, circumferential groove, material color, highlights and proportions. Remove background also visible THROUGH the central hole, but keep all actual inner metal surfaces. Do not redesign, recolor, rotate or add parts. Output a tightly framed single ring with 8% transparent padding, centered, on a truly transparent RGBA PNG background with clean antialiased edges. No checkerboard baked into the pixels. No text or logo.

Final extraction: local Bezier masks and antialiased alpha using original screenshots; see `source/cutout-paths.json` and `source/export-cutouts.py`.
