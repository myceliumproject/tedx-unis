/**
 *
 * @param {(e: FormEvent<HTMLFormElement>) => void} fn
 * @returns {(e: FormEvent<HTMLFormElement>) => void}
 */
export function wrapSubmit(fn) {
  return (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    return fn(e);
  };
}

/**
 *
 * @param {Date} date
 */
export function timeTo(date) {
  let seconds = Math.floor((date - new Date()) / 1000);

  const result = [];
  let interval = seconds / 86400;
  result.push(Math.floor(interval).toString().padStart(2, "0"));
  seconds = seconds % 86400;

  interval = seconds / 3600;
  result.push(Math.floor(interval).toString().padStart(2, "0"));
  seconds = seconds % 3600;

  interval = seconds / 60;
  result.push(Math.floor(interval).toString().padStart(2, "0"));
  seconds = seconds % 60;

  result.push(Math.floor(seconds).toString().padStart(2, "0"));

  return result.join(":");
}
