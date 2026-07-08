export async function safeFetchText(url, options) {
  console.log(options);
  let response;
  try {
    response = await fetch(url, options);
    if (!response.ok) {
      return { error: response.status, response };
    }
  } catch (error) {
    return { error: { status: 559, message: error.message } };
  }
  try {
    return { data: { data: await response.text(), response } };
  } catch (error) {
    return { error: { status: 599, message: error.message } };
  }
}
