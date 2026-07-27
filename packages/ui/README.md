# @workspace/ui

A shared React component library with accessible UI primitives built with Tailwind CSS and Base UI.

## Components

All components are located in `src/components/` and exported through the package's export map in `package.json`.

- **Button** - Versatile button component with multiple variants and sizes
- **Input** - Text input field with support for invalid states
- **Badge** - Label component for categorization
- **Dialog** - Modal dialog for focused user interactions
- **Tabs** - Tabbed interface for content organization
- **Tabs** - Tabbed interface with keyboard navigation support
- **Slider** - Range input slider component
- **Tooltip** - Contextual information on hover
- **Sheet** - Side panel component
- **Skeleton** - Content placeholder loaders
- **Separator** - Divider component
- **TokenAvatar** - Token icon with fallback initials
- **TokenPair** - Overlapping token pair visual
- **TransactionStatus** - Transaction state indicator with actions

## Testing

All interactive components include accessibility tests using `vitest-axe` to ensure WCAG compliance.

### Running tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# View test results in UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test coverage

Every interactive primitive has automated accessibility checks that:
- Verify no critical or serious axe violations
- Test keyboard navigation for interactive components
- Validate ARIA attributes and roles
- Check focus management

## Development

```bash
# Format code
npm run format

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Usage

Import components from the package:

```tsx
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { TokenAvatar } from "@workspace/ui/components/token-avatar"
```
