interface FormatProps {
  content: string;
}

export function format({ content }: FormatProps) {
  const italic = content.match(/(^(?!.*\*)|(?<=\*))(.|\n)*?((?=\*)|$)/g);
  const strikethrough = content.match(/(^(?!.*~~)|(?<=~~))(.|\n)*?((?=~~)|$)/g);

  return [
    {
      exp: italic,
      tag: "*",
      render: (str: string) => `<span class="italic">${str}</span>`,
    },
    {
      exp: strikethrough,
      tag: "~~",
      render: (str: string) => `<span class="line-through">${str}</span>`,
    },
  ].reduce<string>((acc, { exp, tag, render }) => {
    if (!exp?.length) {
      return acc;
    }

    return exp.reduce<string>((acc1, value) => {
      return acc1.replace(`${tag}${value}${tag}`, render(value));
    }, acc);
  }, content);
}
