// cspell:disable
import React from "react";
import { Link, type LinkProps } from "expo-router";

// ...existing code...
type ExternalLinkProps = {
  href: string | LinkProps["href"];
  children: React.ReactNode;
  replace?: boolean;
};

export default function ExternalLink({ href, children, replace }: ExternalLinkProps) {
  // cast para compatibilidade com o tipo mais restrito do expo-router
  return (
    <Link href={href as LinkProps["href"]} replace={replace}>
      {children}
    </Link>
  );
}
// ...existing code...