import { defineMiddleware } from "astro:middleware";
import { supabase } from "../db/db";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  const isProtectedRoute = url.pathname.startsWith("/admin/");

  const refreshTokenCookie = context.cookies.get("sb-refresh-token");
  const accessTokenCookie = context.cookies.get("sb-access-token");

  const refreshToken = refreshTokenCookie?.value || null;
  const accessToken = accessTokenCookie?.value || null;

  context.locals.user = null;

  // Verificar si hay un token de acceso válido antes de intentar refrescar la sesión
  if (accessToken) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);
    if (!error && user) {
      context.locals.user = user;
    }
  }

  // Si no hay usuario y hay un refresh token, intentar refrescar la sesión
  if (!context.locals.user && refreshToken) {
    const { data: sessionData, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (sessionData?.session && !error) {
      context.cookies.set("sb-access-token", sessionData.session.access_token, {
        httpOnly: true,
        path: "/",
      });
      context.cookies.set(
        "sb-refresh-token",
        sessionData.session.refresh_token,
        {
          httpOnly: true,
          path: "/",
        }
      );

      context.locals.user = sessionData.user;
    }
  }

  // Redirección si no hay usuario en una ruta protegida
  if (!context.locals.user && isProtectedRoute) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  // Redirección si ya está logueado e intenta acceder al login
  if (context.locals.user && url.pathname === "/login") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/admin/dashboard" },
    });
  }

  return next();
});
