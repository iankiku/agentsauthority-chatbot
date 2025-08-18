# Design System - AgentAuthority

## **🎨 Color Palette**

### **Primary Colors**

```css
/* Premium Black & Gold Theme */
--primary-gold: #ffd700; /* Classic gold - Primary accent */
--dark-gold: #b8860b; /* Darker gold - Hover states */
--light-gold: #fff8dc; /* Light gold - Backgrounds */
--accent-gold: #ffa500; /* Orange gold - Secondary accent */

/* Black Scale */
--pure-black: #000000; /* Primary black */
--dark-gray: #1a1a1a; /* Secondary black */
--medium-gray: #333333; /* Accent black */
--light-gray: #666666; /* Text gray */
--white: #ffffff; /* Pure white */
```

### **Semantic Colors**

```css
/* Success & Error (Minimal Usage) */
--success-green: #10b981; /* Only for critical success states */
--error-red: #ef4444; /* Only for critical error states */

/* Backgrounds */
--bg-primary: #000000; /* Main background */
--bg-secondary: #1a1a1a; /* Secondary background */
--bg-card: #ffffff; /* Card backgrounds */
--bg-overlay: rgba(0, 0, 0, 0.8); /* Overlay backgrounds */
```

### **Text Colors**

```css
--text-primary: #000000; /* Primary text on white */
--text-secondary: #333333; /* Secondary text */
--text-muted: #666666; /* Muted text */
--text-gold: #ffd700; /* Gold accent text */
--text-white: #ffffff; /* White text on black */
```

## **🎯 Design Principles**

### **1. Premium Black & Gold Aesthetic**

- **Primary**: Black backgrounds with gold accents
- **Secondary**: White cards with black text
- **Accent**: Gold highlights and CTAs
- **Minimal**: Maximum 3 colors visible at any time

### **2. High Contrast & Readability**

- **Black on White**: Primary text and content
- **Gold on Black**: CTAs and important actions
- **White on Black**: Headers and navigation
- **Accessibility**: WCAG AA compliant contrast ratios

### **3. Sophisticated Visual Hierarchy**

- **Gold**: Primary actions, highlights, brand elements
- **Black**: Backgrounds, text, structure
- **White**: Cards, content areas, contrast
- **Gray**: Secondary elements, borders

### **4. Consistent Component Styling**

- **Cards**: White background with subtle shadows
- **Buttons**: Gold primary, black outline secondary
- **Navigation**: Black background with gold accents
- **Typography**: Black text on white, gold for emphasis

## **📱 Component Guidelines**

### **Buttons**

```css
/* Primary Button */
.btn-primary {
	background: var(--primary-gold);
	color: var(--pure-black);
	border: none;
}

/* Secondary Button */
.btn-secondary {
	background: transparent;
	color: var(--primary-gold);
	border: 2px solid var(--primary-gold);
}

/* Hover States */
.btn-primary:hover {
	background: var(--dark-gold);
}

.btn-secondary:hover {
	background: var(--primary-gold);
	color: var(--pure-black);
}
```

### **Cards**

```css
.card {
	background: var(--white);
	border: 1px solid #e5e5e5;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### **Navigation**

```css
.nav {
	background: var(--pure-black);
	color: var(--white);
}

.nav-accent {
	color: var(--primary-gold);
}
```

## **🎨 Usage Examples**

### **Landing Page Hero**

- **Background**: Black (`#000000`)
- **Text**: White (`#FFFFFF`)
- **CTA Button**: Gold (`#FFD700`) with black text
- **Accent Elements**: Gold highlights

### **Feature Cards**

- **Background**: White (`#FFFFFF`)
- **Text**: Black (`#000000`)
- **Icons**: Gold (`#FFD700`)
- **Borders**: Light gray (`#E5E5E5`)

### **Navigation**

- **Background**: Black (`#000000`)
- **Text**: White (`#FFFFFF`)
- **Active States**: Gold (`#FFD700`)
- **Hover**: Light gold (`#FFF8DC`)

## **🚫 Avoid These Patterns**

### **❌ Don't Use**

- Multiple colors simultaneously (keep to 3 max)
- Light backgrounds with light text
- Gold on gold combinations
- Inconsistent color usage across components

### **✅ Do Use**

- Black backgrounds with gold accents
- White cards with black text
- Gold CTAs on black backgrounds
- Consistent color application

## **🎯 Brand Identity**

### **Personality**

- **Premium**: Sophisticated black & gold aesthetic
- **Professional**: Clean, modern design
- **Trustworthy**: High contrast, readable typography
- **Innovative**: Contemporary layout with classic colors

### **Voice**

- **Confident**: Bold black backgrounds
- **Valuable**: Premium gold accents
- **Clear**: High contrast readability
- **Modern**: Contemporary design patterns

This black & gold design system creates a **premium, sophisticated, and
professional** brand identity that emphasizes value and quality while
maintaining excellent usability and accessibility.
