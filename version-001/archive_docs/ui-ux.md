# Fragment V2 UI/UX Design System

## Overview

This document outlines the comprehensive design system for Fragment V2's
dashboard and chat interface, establishing a clean, modern aesthetic with soft
white backgrounds and strategic orange accents. The design prioritizes
accessibility, readability, and professional elegance while maintaining modern
interaction patterns inspired by contemporary dashboard designs.

## Design Philosophy

**"Clean and considered but in an invisible sort of way"**

- **Simplicity over complexity**: Clean layouts with generous white space and
  minimal visual noise
- **Function over form**: Every design element serves a clear purpose and
  enhances user experience
- **Accessibility first**: Ensure WCAG 2.1 AA compliance for all text and
  interactive elements
- **Professional aesthetic**: Modern dashboard design with soft white
  backgrounds and strategic orange accents
- **Cohesive branding**: Align with Agents Authority design system using orange
  as the primary brand color

## Color System

### Primary Palette (Agents Authority Design System)

```css
/* Base Colors */
--background: #ffffff; /* Clean white background */
--surface: #f8fafc; /* Slightly lifted surface (gray-50) */
--card: #ffffff; /* Card backgrounds - pure white */
--elevated: #f0f0f0; /* Elevated elements (modals, dropdowns) */

/* Text Colors */
--text-primary: #000000; /* High contrast black text */
--text-secondary: #727272; /* Medium gray for secondary content */
--text-muted: #b0b0b0; /* Light gray for muted text */
--text-disabled: #b0b0b0; /* Disabled states */

/* Accent Colors */
--primary: #ff983b; /* Orange - Agents Authority brand color */
--primary-hover: #ea6020; /* Darker orange for hover states */
--primary-light: #ffe9df; /* Light orange for highlights */
--primary-alpha: rgba(255, 152, 59, 0.1); /* Semi-transparent orange */

/* Semantic Colors */
--success: #97c765; /* Green for success states */
--warning: #ffcb05; /* Yellow for warnings */
--error: #ed1c24; /* Red for errors */
--info: #0088cb; /* Blue for information */

/* Border Colors */
--border: #f0f0f0; /* Light gray borders */
--border-hover: #b0b0b0; /* Medium gray for hover states */
--border-focus: #ff983b; /* Orange focus borders (primary color) */
```

### Color Usage Guidelines

1. **Background Hierarchy**: Use `--background` (white) for the main canvas,
   `--surface` (light gray) for content areas, and `--card` (white) for
   individual components
2. **Text Contrast**: Always use `--text-primary` (black) for important content,
   `--text-secondary` (medium gray) for body text, and `--text-muted` (light
   gray) for supplementary information
3. **Orange Accent Usage**: Use `--primary` (orange) strategically for CTAs,
   active states, and brand moments. Apply sparingly for maximum impact
4. **Semantic Colors**: Reserve for status indicators, alerts, and feedback
   messages only
5. **White Space**: Leverage generous white space to create clean, breathable
   layouts
6. **Subtle Borders**: Use light gray borders (`--border`) to define sections
   without creating visual noise

## Dashboard Design Patterns

### Landing Page Layout

**Hero Section:**

- Clean white background with subtle gray surface areas
- Generous padding and white space
- Orange accent for primary CTA buttons
- Typography hierarchy with black text on white backgrounds

**Navigation:**

- Minimal, clean navigation bar
- Orange highlights for active states
- Subtle hover effects with gray backgrounds

**Content Cards:**

- White cards with subtle gray borders
- Consistent padding and border radius
- Orange accents for interactive elements
- Drop shadows for elevation

### V2 Chat Interface Design

**Layout Structure:**

- Full-height white background with clean, minimal design
- Chat messages in white cards with subtle gray borders
- Input area at bottom with white background and orange accent for send button
- Generous white space between elements

**Chat Components:**

- **Message Bubbles**: White background with light gray borders, black text
- **Input Field**: White background with gray border, orange focus state
- **Send Button**: Orange background with white text
- **Suggestions**: White cards with gray borders, orange hover states

**Interactive States:**

- **Hover**: Subtle gray background changes
- **Focus**: Orange border highlights
- **Active**: Orange accent colors
- **Loading**: Subtle gray animations

**Typography:**

- Primary text in black for high contrast
- Secondary text in medium gray
- Muted text in light gray
- IBM Plex Sans for clean, professional appearance

## Typography System

### Font Stack

```css
/* Primary Sans-Serif */
--font-sans:
	"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
	sans-serif;

/* Monospace (for code) */
--font-mono: "IBM Plex Mono", "SF Mono", "Monaco", "Cascadia Code", monospace;
```

### Type Scale

```css
/* Headings */
--text-4xl: 2.25rem; /* 36px - Main hero text */
--text-3xl: 1.875rem; /* 30px - Section headers */
--text-2xl: 1.5rem; /* 24px - Component titles */
--text-xl: 1.25rem; /* 20px - Large body text */

/* Body */
--text-base: 1rem; /* 16px - Default body text */
--text-sm: 0.875rem; /* 14px - Small text, descriptions */
--text-xs: 0.75rem; /* 12px - Captions, labels */

/* Line Heights */
--leading-tight: 1.25; /* For headings */
--leading-normal: 1.5; /* For body text */
--leading-relaxed: 1.625; /* For large text blocks */
```

### Typography Usage

1. **Hierarchy**: Use size and weight to establish clear information hierarchy
2. **Line Height**: Tighter for headings (1.25), normal for body (1.5)
3. **Letter Spacing**: Default for most text, slightly increased for all-caps
   labels
4. **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## Spacing System

### Base Unit: 4px

```css
/* Spacing Scale */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

### Spacing Guidelines

1. **Consistent Rhythm**: Use multiples of 4px for all spacing
2. **Component Padding**: Minimum 16px (--space-4) for interactive elements
3. **Section Spacing**: Use --space-12 to --space-20 for major content sections
4. **Text Spacing**: --space-2 to --space-4 between related text elements

## Component Specifications

### Chat Input

**Visual Requirements:**

- Fixed position at bottom of screen
- Maximum width: 800px on desktop, full width on mobile with 16px margin
- Background: `--card` with subtle border using `--border`
- Border radius: 12px (--space-3)
- Internal padding: 16px (--space-4)

**Interactive States:**

- Default: Border `--border`, no shadow
- Focus: Border `--primary`, subtle glow with `--primary-alpha`
- Disabled: Background `--surface`, text `--text-disabled`

**Implementation:**

```css
.chat-input {
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: 0.75rem;
	padding: 1rem;
	transition: all 200ms ease;
}

.chat-input:focus-within {
	border-color: var(--primary);
	box-shadow: 0 0 0 3px var(--primary-alpha);
}
```

### Message Cards

**Layout:**

- Maximum width: 700px for readability
- Padding: 24px (--space-6) on desktop, 16px (--space-4) on mobile
- Background: `--card` for AI messages, `--surface` for user messages
- Subtle border: `--border`

**Typography:**

- Message content: `--text-base` with `--leading-normal`
- Timestamps: `--text-xs` with `--text-muted`
- User names: `--text-sm` with `--text-secondary`

### Action Buttons

**Primary Button (Send, Submit):**

```css
.btn-primary {
	background: var(--primary);
	color: var(--text-primary);
	border: none;
	border-radius: 0.5rem;
	padding: 0.75rem 1.5rem;
	font-weight: 500;
	transition: background-color 200ms ease;
}

.btn-primary:hover {
	background: var(--primary-hover);
}

.btn-primary:disabled {
	background: var(--text-disabled);
	cursor: not-allowed;
}
```

**Secondary Button (Cancel, Retry):**

```css
.btn-secondary {
	background: transparent;
	color: var(--text-secondary);
	border: 1px solid var(--border);
	border-radius: 0.5rem;
	padding: 0.75rem 1.5rem;
	font-weight: 500;
	transition: all 200ms ease;
}

.btn-secondary:hover {
	background: var(--surface);
	border-color: var(--border-hover);
}
```

### Example Query Cards

**Layout:**

- Grid layout: 1 column on mobile, 2 on tablet, 4 on desktop
- Aspect ratio: Flexible height based on content
- Gap: 16px (--space-4) between cards
- Padding: 20px (--space-5) internal padding

**Visual Design:**

```css
.example-card {
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: 0.75rem;
	padding: 1.25rem;
	cursor: pointer;
	transition: all 200ms ease;
}

.example-card:hover {
	background: var(--elevated);
	border-color: var(--border-hover);
	transform: translateY(-2px);
}
```

**Icon Treatment:**

- Size: 20px (--space-5) for card icons
- Color: `--primary` for consistency
- Background: `--primary-alpha` circular background (40px diameter)

## Interaction Design

### Hover Effects

**Principles:**

- Subtle elevation (2px translateY) for cards
- Color transitions (200ms ease)
- No dramatic scale changes or rotations
- Maintain accessibility for reduced motion preferences

### Focus States

**Requirements:**

- Visible focus indicators for all interactive elements
- Use `--primary` color for focus outlines
- 3px outline with 2px offset for buttons
- Subtle glow for input fields

### Loading States

**Spinner Design:**

```css
.loading-spinner {
	width: 20px;
	height: 20px;
	border: 2px solid var(--border);
	border-top-color: var(--primary);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}
```

**Skeleton Loading:**

- Use `--surface` for skeleton backgrounds
- Subtle pulse animation (opacity 0.5 to 0.7)
- Match content dimensions approximately

### Motion Design

**Animation Principles:**

- Use `ease-out` easing for entrances (200-300ms)
- Use `ease-in` for exits (150-200ms)
- Respect `prefers-reduced-motion: reduce`
- Keep animations subtle and purposeful

**Common Animations:**

```css
/* Fade in for new content */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Scale in for modals/toasts */
@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px; /* Small tablets */
--breakpoint-md: 768px; /* Tablets */
--breakpoint-lg: 1024px; /* Desktop */
--breakpoint-xl: 1280px; /* Large desktop */
```

### Layout Adaptations

**Mobile (< 640px):**

- Single column layout
- Full-width chat input with 16px margins
- Reduced padding (12px instead of 20px)
- Larger touch targets (minimum 44px)

**Tablet (640px - 1024px):**

- Two-column grid for example cards
- Chat input maximum width: 600px
- Moderate spacing adjustments

**Desktop (> 1024px):**

- Four-column grid for example cards
- Chat input maximum width: 800px
- Full spacing scale applied

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Color Contrast:**

- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

**Keyboard Navigation:**

- All interactive elements must be focusable
- Clear focus indicators required
- Logical tab order maintained

**Screen Reader Support:**

- Semantic HTML structure
- ARIA labels for complex interactions
- Alt text for all meaningful images/icons

### Implementation Checklist

- [ ] Test with screen readers (VoiceOver, NVDA)
- [ ] Verify keyboard-only navigation
- [ ] Check color contrast ratios
- [ ] Test with reduced motion preferences
- [ ] Validate with accessibility testing tools

## Implementation Guidelines

### CSS Custom Properties Usage

**Define at root level:**

```css
:root {
	/* Use semantic names, not specific colors */
	--color-primary: #21808d;
	--color-surface: #111111;
	/* Include fallbacks for older browsers */
	--shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

### Tailwind Integration

**Extend default theme:**

```javascript
// tailwind.config.js
module.exports = {
	theme: {
		extend: {
			colors: {
				primary: "var(--primary)",
				surface: "var(--surface)",
				// ... other custom colors
			},
			fontFamily: {
				sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
				mono: ["IBM Plex Mono", "monospace"],
			},
		},
	},
};
```

### Component Architecture

**Use CSS-in-JS or CSS Modules for component-specific styles:**

```jsx
// Example React component
const ChatInput = styled.div`
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: 0.75rem;

	&:focus-within {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-alpha);
	}

	@media (max-width: 640px) {
		margin: 0 1rem;
	}
`;
```

## Quality Assurance

### Testing Requirements

1. **Visual Regression Testing**: Compare before/after screenshots
2. **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
3. **Device Testing**: iOS Safari, Android Chrome
4. **Accessibility Audit**: Use axe-core or similar tools

### Performance Considerations

1. **CSS Optimization**: Use PostCSS for vendor prefixes and optimization
2. **Asset Loading**: Preload critical fonts, lazy load icons
3. **Animation Performance**: Use `transform` and `opacity` for animations
4. **Bundle Size**: Monitor CSS bundle size and remove unused styles

## Maintenance and Evolution

### Documentation Updates

- Update this document when design tokens change
- Maintain a changelog of visual updates
- Document component variations and use cases

### Design Review Process

1. **Consistency Check**: Ensure new components follow established patterns
2. **Accessibility Review**: Test with assistive technologies
3. **Performance Impact**: Measure load time and rendering performance
4. **User Feedback**: Gather feedback on usability improvements

---

This design system provides a complete foundation for implementing a
professional, accessible, and visually appealing chat interface that addresses
the current contrast issues while establishing a cohesive Perplexity-inspired
aesthetic.
