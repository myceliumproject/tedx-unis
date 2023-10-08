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
