import { type ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-fd-card p-5 transition-all duration-300 hover:border-fd-primary/50 hover:shadow-lg hover:shadow-fd-primary/5">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        {/* Icon with background */}
        <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary transition-colors duration-300 group-hover:bg-fd-primary/20 [&>svg]:size-5">
          {icon}
        </div>
        
        <h3 className="mb-1.5 font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-fd-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
