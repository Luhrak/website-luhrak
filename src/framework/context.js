export default class Context {
  // Create Context from Request
  constructor(request) {
    /* Request fields */
    this.request = request;
    this.url = new URL(request.url);
    this.method = request.method;
    this.entryId = undefined; // easy access to id for detailpages as its not saved seperately in the request itself
    /* Fetchable */
    this.cookies = {};
    this.session = {};
    /* Response fields */
    this.body = undefined;
    this.headers = new Headers();
    this.status = undefined;
    /* Other */
    this.serveStatic = false; // So middleware can check rather the currect request is a public file or not
    this.flash = undefined;
    this.logTime = new Date(); // The time the server recieves the request
  }

  // Create a Respone from Context
  extractResponse() {
    this.status = this.status ?? 404;
    this.body =
      !this.body && this.status >= 400 ? "Error " + this.status : this.body;
    return new Response(this.body, {
      status: this.status,
      headers: this.headers,
    });
  }
}
