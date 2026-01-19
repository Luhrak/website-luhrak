export function createSessionStore() {
  // Creates a storage for the Server to keep current sessions
  const sessionStore = new Map();

  return {
    get(key) {
      // Returns a session via the key
      const data = sessionStore.get(key);
      if (!data) return;
      return data.maxAge < Date.now() ? this.delete(key) : data.session;
    },
    set(key, session, maxAge) {
      // Creates a new session
      sessionStore.set(key, {
        session,
        maxAge: Date.now() + maxAge,
      });
    },
    delete(key) {
      // Deletes a session via the key
      sessionStore.delete(key);
    },
    applyTimeout(key, maxAge) {
      // Deltes old sessions that are over the max age
      const sessionOld = sessionStore.get(key);
      if (sessionOld) {
        sessionOld.maxAge = maxAge + Date.now();
      }
    },
  };
}
