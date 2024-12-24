export const params = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  const message = urlParams.get('message');
  const type = urlParams.get('type');
  const id = urlParams.get('id');
  return { status, message, type, id };
};
