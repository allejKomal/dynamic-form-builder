import React from "react";

import Link from "next/link";

import { ArrowLeft, ExternalLink, Github } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonLabel?: string;
  title?: string;
  description?: string;
  showFooter?: boolean;
}

function PageWrapper({
  children,
  className = "",
  showBackButton = false,
  backButtonHref = "/",
  backButtonLabel = "Back to Home",
  title,
  description,
  showFooter = true,
}: PageWrapperProps) {
  return (
    <div>
      <ScrollArea className={cn("h-[100vh]", className)}>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header Section */}
          {(showBackButton || title) && (
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between gap-4 w-full">
                    {title && (
                      <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                          {title}
                        </h1>
                        {description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {description}
                          </p>
                        )}
                      </div>
                    )}
                    {showBackButton && (
                      <Link href={backButtonHref}>
                        <Button variant="outline" size="sm">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          {backButtonLabel}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">{children}</div>

          {/* Footer Section */}
          {showFooter && (
            <footer className="border-t bg-muted/30 mt-auto">
              <div className="container mx-auto px-6 py-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                      Created by{" "}
                      <a
                        href="https://github.com/allejkomal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        allejkomal
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      A collection of reusable UI components and layouts
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://github.com/allejkomal/rkit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}

export default PageWrapper;
