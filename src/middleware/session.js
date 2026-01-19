import { sessionStore } from "../service/sessionStore.js";
import { encodeBase64 } from "jsr:@std/encoding/base64";
import { getCookies, setCookie, deleteCookie } from "jsr:@std/http";

export function getSession(ctx) {
  // Sets cookies and session into ctx
  ctx.cookies = getCookies(ctx.request.headers);
  ctx.sessionId = ctx.cookies?.sessionId;
  // Sort out old sessions before loading to not get an old invalid one
  if (ctx.sessionId) sessionStore().applyTimeout(ctx.sessionId, 86400);
  ctx.session = sessionStore().get(ctx.sessionId) ?? {};

  // Somehow loading flash messages when not logged in wont
  // work eventhough they seem to be saved correctly
  return ctx;
}

export function saveSession(ctx) {
  // Session saved to cookie & sessionStore via id, and some cleanup

  if (ctx.session.flashUsed && !ctx.session.serveStatic) {
    // delete flash messages that were displayed this request
    delete ctx.session.flash;
    delete ctx.session.flashUsed;
  }

  if (hasData(ctx.session)) {
    ctx.sessionId = ctx.sessionId ?? createId();
    sessionStore().set(ctx.sessionId, ctx.session, 86400);
    setCookie(ctx.headers, {
      name: "sessionId",
      value: ctx.sessionId,
      maxAge: 86400, // 24 hours
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
      // secure: true, // https only, usually needed, but we dont have a certificate
    });
  } else {
    sessionStore().delete(ctx.sessionId);
    deleteCookie(ctx.headers, "sessionId");
  }
}

const hasData = (session) => Object.values(session).some((it) => Boolean(it));

const createId = () => {
  // Creates a session id which is a 64 character long random string
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return encodeBase64(array);
};
