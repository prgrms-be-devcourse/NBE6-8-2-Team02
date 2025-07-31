import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white shadow-md p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={clsx("mb-2", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h2 className={clsx("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h2>
  );
}

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <p className={clsx("text-sm text-gray-600", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={clsx("text-sm text-gray-700", className)}>
      {children}
    </div>
  );
}
