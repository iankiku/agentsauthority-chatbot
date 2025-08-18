# Agents Authority Design System

## Brand Identity

**Primary Brand Color:** Orange (#FF983B) - Used sparingly for accents and CTAs
**Background:** White (#FFFFFF) - Clean, minimal foundation  
**Text:** Black (#000000) - High contrast for optimal readability

## Color Palette

### Core Colors
- **White:** `#FFFFFF` (rgb(255, 255, 255))
- **Black:** `#000000` (rgb(0, 0, 0))
- **Orange (Primary):** `#FF983B` (rgb(255, 152, 59))

### Extended Palette
#### Grays
- **Light Gray:** `#F0F0F0` (rgb(240, 240, 240))
- **Medium Gray:** `#727272` (rgb(114, 114, 114))
- **Dark Gray:** `#B0B0B0` (rgb(176, 176, 176))

#### Blues
- **Navy:** `#001E36` (rgb(0, 30, 54))
- **Light Blue:** `#DCE8FF` (rgb(220, 232, 255))
- **Medium Blue:** `#95B9FF` (rgb(149, 185, 255))
- **Bright Blue:** `#0088CB` (rgb(0, 136, 203))

#### Greens
- **Light Green:** `#EBFFB1` (rgb(235, 255, 177))
- **Sage Green:** `#F3F8F0` (rgb(243, 248, 240))
- **Medium Green:** `#D2E4C7` (rgb(210, 228, 199))

#### Additional Colors
- **Red:** `#ED1C24` (rgb(237, 28, 36))
- **Yellow:** `#FFCB05` (rgb(255, 203, 5))

### Orange Variations (Primary Brand Color Shades)
- **Light Orange:** `#FFE9DF` (rgb(255, 233, 223))
- **Medium Orange:** `#FFBFA1` (rgb(255, 191, 161))
- **Orange:** `#FF983B` (rgb(255, 152, 59))
- **Dark Orange:** `#EA6020` (rgb(234, 96, 32))
- **Darkest Orange:** `#C94001` (rgb(201, 64, 1))

## Typography

### Font Families
- **Primary:** Novatica (Custom font: `wfont_0784b1_f2627598deb347fc9eee8a8000c79847`)
- **Secondary:** Wix MadeFor Text v2
- **Fallback:** DIN Next Light, sans-serif

### Font Scale
- **H1:** `82px` / 1.1em (Primary font)
- **H2:** `64px` / 1.2em (Primary font)
- **H3:** `40px` / 1.1em (Primary font)
- **H4:** `51px` / 1.3em (Primary font)
- **H5:** `42px` / 1.3em (Primary font)
- **H6:** `33px` / 1.4em (Primary font)
- **Body Large:** `24px` / 1.4em (Secondary font)
- **Body Medium:** `20px` / 1.4em (Secondary font)
- **Body Small:** `16px` / 1.4em (Secondary font)
- **Body X-Small:** `12px` / 1.4em (Fallback font)

## Layout & Spacing

### Container Widths
- **Site Width:** `980px`
- **Max Width:** `1920px`
- **Min Viewport:** `320px`

### Padding & Margins
- **Section Padding:** `12vw` (responsive viewport-based)
- **Standard Spacing:** Based on `--one-unit` system
- **Border Radius:** `5px` (standard), `0px` (minimal)

## Component Styles

### Buttons

#### Primary Button
- **Background:** Orange `#FF983B`
- **Border:** Orange `#FF983B`
- **Text:** White `#FFFFFF`
- **Hover Background:** Orange variant
- **Hover Border:** Orange variant
- **Hover Text:** White `#FFFFFF`

#### Secondary Button
- **Background:** White `#FFFFFF`
- **Border:** Orange `#FF983B`
- **Text:** Orange `#FF983B`
- **Hover Background:** White `#FFFFFF`
- **Hover Border:** Orange variant
- **Hover Text:** Orange variant

### Cards & Containers
- **Background:** White `#FFFFFF`
- **Border:** `1px solid` with color variants
- **Border Radius:** `5px`
- **Box Shadow:** `0 1px 4px rgba(0, 0, 0, 0.6)`

### Forms & Inputs
- **Background:** Light Gray `#F0F0F0`
- **Border:** Navy `#001E36`
- **Text:** Black `#000000`
- **Focus State:** Orange accent

## Design Principles

### Color Usage
1. **Orange is the hero** - Use sparingly for maximum impact
2. **White space is king** - Generous white backgrounds create clean, modern feel
3. **High contrast** - Black text on white backgrounds for accessibility
4. **Systematic approach** - Use defined color tokens consistently

### Layout Philosophy
- **Grid-based layouts** with responsive behavior
- **Generous spacing** using viewport-relative units
- **Flexible containers** that adapt to content
- **Clean, minimal aesthetic** with purposeful orange accents

### Accessibility
- **High contrast ratios** (Black on White)
- **Clear typography hierarchy**
- **Consistent interactive states**
- **Semantic color usage**

## Implementation Notes

### CSS Custom Properties
The system uses CSS custom properties extensively for:
- Color management (`--color_n` tokens)
- Font scaling (`--font_n` tokens)
- Responsive spacing (`--theme-spx-ratio`)
- Component theming (`--wst-*` prefixed tokens)

### Responsive Behavior
- **Viewport-based scaling** using `calc()` and viewport units
- **Container queries** support where available
- **Fluid typography** that scales with screen size
- **Flexible grid systems** for layout adaptation

### Brand Application
- Use orange **strategically** - not as a dominant color but as a powerful accent
- Maintain **generous white space** to let content breathe
- Ensure **high contrast** for optimal readability
- Apply **consistent spacing** using the defined system