import { sessionStore } from "../service/sessionStore.js";
import { encode as base64Encode } from "https://deno.land/std@0.82.0/encoding/base64.ts";
import { getCookies, setCookie, deleteCookie } from "jsr:@std/http";

export function handleSession(ctx) {
  ctx.cookies = getCookies(ctx.request.headers);
  ctx.sessionId = ctx.cookies?.sessionId;
  ctx.session = sessionStore().get(ctx.sessionId) ?? {};

  if (hasData(ctx.session)) {
    ctx.sessionId = ctx.sessionId ?? createId();
    sessionStore().set(ctx.sessionId, ctx.session);
    setCookie(ctx.headers, { name: "sessionId", value: ctx.sessionId }); // cookie would be set
  } else {
    // but instead always false so far
    sessionStore().delete(ctx.sessionId);
    deleteCookie(ctx.headers, "sessionId");
  }
  return ctx;
}

const hasData = (session) => Object.values(session).some((it) => Boolean(it));

export const createId = () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64Encode(array);
};
