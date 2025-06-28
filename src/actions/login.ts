import { ActionError, defineAction } from "astro:actions";
import { supabase } from "../db/db";
import { z } from "astro/zod";

export const login = defineAction({
  accept: "form",
  input: z.object({
    identifier: z.string(),
    password: z.string(),
  }),
  handler: async (input, context) => {
    console.log("Iniciando sesión con:", input);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.identifier,
        password: input.password,
      });

      if (error || !data) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Correo electrónico o contraseña inválidos.",
        });
      }

      const { access_token, refresh_token } = data.session;

      // Establecer las cookies utilizando context.cookies
      context.cookies.set("sb-access-token", access_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      context.cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return { success: true };
    } catch (error) {
      console.error("Ocurrió un error inesperado:", error);
      throw new ActionError({
        code: "BAD_REQUEST",
        message:
          "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  },
});
