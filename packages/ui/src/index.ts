/**
 * @shimokitan/ui - Shared component library
 *
 * Re-exports all public components and utilities for the monorepo.
 */

// --- Primitives (shadcn/ui) ---
export { Button, buttonVariants } from "./components/ui/button";
export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "./components/ui/dialog";
export { Toaster } from "./components/ui/sonner";
export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./components/ui/select";
export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";

// --- Composite Components ---
export { AudioWidget } from "./components/AudioWidget";
export { Badge, badgeVariants } from "./components/Badge";
export { BentoCard } from "./components/BentoCard";
export { CyberpunkShell, CyberpunkStyles } from "./components/CyberpunkShell";
export { NavigationLink } from "./components/NavigationLink";

// --- Theme ---
export { ThemeProvider } from "./components/theme-provider";

// --- Utilities ---
export { cn } from "./lib/utils";
