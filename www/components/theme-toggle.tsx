"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react"; 
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // This effect runs only once on the client to set the mounted state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Prevent hydration error by only rendering the button after the component is mounted
  if (!mounted) return null;

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="lucide lucide-sun h-[1.1rem] w-[1.1rem]" />
      ) : (
        <Moon className="lucide lucide-moon h-[1.1rem] w-[1.1rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
