import * as sessionStore from "../feature/session/model.js";
// import { sessionStore } from "../service/sessionStore.js";
import { encodeBase64 } from "jsr:@std/encoding/base64";
import { getCookies, setCookie, deleteCookie } from "jsr:@std/http";

const twentyFourHours = 86400000;

export async function getSession(ctx) {
  // Sets cookies and session into ctx, cant know if its serveStatic
  ctx.cookies = getCookies(ctx.request.headers);
  const sessionId = ctx.cookies?.sessionId;
  // Sort out old sessions before loading to not get an old invalid one
  // if (sessionId) await sessionStore.applyTimeout(sessionId);
  ctx.session = (await sessionStore.get(sessionId)) ?? { content: {} };
  console.log("gotten session:");
  console.log(ctx.session);

  // Somehow loading flash messages when not logged in wont
  // work eventhough they seem to be saved correctly
  return ctx;
}

export async function updateSession(ctx) {
  // Saves session to cookie & db, deletes if empty
  const session = ctx.session;
  cleanUpSession(session.content);

  if (sessionHasContent(session.content)) {
    session.id = session.id ?? createId();
    await sessionStore.upsert(session.id, session.content, twentyFourHours);
    setCookie(ctx.headers, {
      name: "sessionId",
      value: session.id,
      maxAge: twentyFourHours,
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
      // secure: true, // https only, usually needed, but we dont have a certificate
    });
  } else {
    console.log("session empty, deleting");
    await sessionStore.remove(session.id);
    deleteCookie(ctx.headers, "sessionId");
  }
}

function cleanUpSession(content) {
  // delete flash messages that were already displayed this request
  if (content.flashUsed) {
    delete content.flash;
    delete content.flashUsed;
  }
}

function sessionHasContent(content) {
  console.log("content true:");
  console.log(content);
  console.log(
    Object.values(content).some((v) => v !== undefined && v !== null),
  );
  return Object.values(content).some((v) => v !== undefined && v !== null);
}

const createId = () => {
  // Creates a session id which is a 64 character long random string
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return encodeBase64(array);
};
