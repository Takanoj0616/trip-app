'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CheckInProvider } from "@/contexts/CheckInContext";
import { RouteProvider } from "@/contexts/RouteContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageDirection from "./LanguageDirection";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <LanguageDirection />
      <AuthProvider>
        <FavoritesProvider>
          <CheckInProvider>
            <RouteProvider>
              {children}
            </RouteProvider>
          </CheckInProvider>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
