export function sleep(duration = 1500) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
