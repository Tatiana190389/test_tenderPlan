export default function counterQuotes(str) {
  let index = str.indexOf('"');
  let count = 0;

  while (index !== -1) {
    count++;
    index = str.indexOf('"', index + 1);
  }
  return count;
}
