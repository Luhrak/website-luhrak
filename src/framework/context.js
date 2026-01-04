export default class Context {
  // Create Context from Request.
  constructor(request) {
    /* Request fields */
    this.request = request;
    this.url = new URL(request.url);
    this.method = request.method;
    // for detailpages so we can easily access the id as its not saved seperately in the request itself
    this.entryId = undefined;
    /* Response fields */
    this.body = undefined;
    this.headers = new Headers();
    this.status = undefined;
  }

  // Create a Respone from Context.
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
