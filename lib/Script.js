class Script {
  constructor(text) {
    this.text = text;
  }

  owoify(str) {
    str = str.replace(/Sue/g, 'Suwu');
    str = str.replace(/(?:r|l)/g, 'w');
    str = str.replace(/(?:R|l)/g, 'W');
    str = str.replace(/n([aeiou])/g, 'ny$1');
    str = str.replace(/N([aeiou])/g, 'Ny$1');
    str = str.replace(/N([AEIOU])/g, 'Ny$1');
    str = str.replace(/ove/g, 'uv');
    return str;
  }

  trimToSafeLength(event, meta) {
    const textLimit = meta.isFace ? 18 : 24;
    if (meta.NODlength > 0) {
      event = Array(meta.NODlength).fill('|').join('') + event;
    }

    let sentences = [];
    const words = event.split(' ');
    if (words.length === 1) {
      return event;
    }

    words.reduce((accumulator, current, idx, arr) => {
      const str = `${accumulator} ${current}`;

      if (str.length > textLimit) {
        sentences.push(accumulator);

        if (idx === arr.length - 1) {
          sentences.push(current);
        }

        return current;
      }

      if (idx === arr.length - 1) {
        sentences.push(str);
      }

      return str;
    });

    return sentences.join('\r\n').replace('/\|/g', '');
  }

  convert() {
    const matches = this.text.match(/(\<([A-Z0-9+-]){3}(.*?)(?=\<|#|$))|(#([0-9]){4})/sg);

    let currentIdxMeta = {
      isFace: false,
      NODlength: 0
    };

    return matches
      .map(line => {
        if (line.startsWith('#')) {
          return `${line}\r\n`;
        }

        const TSCtag = line.match(/\<(([A-Z0-9+-]){3}(([0-9]){4})?)((\:([0-9]){4})?){0,3}/g)[0];
        const str = line.substr(TSCtag.length);

        if (TSCtag.startsWith('<FAC')) {
          const param = TSCtag.slice(4);
          currentIdxMeta.isFace = param !== '0000';
        }

        if (str.trim().length === 0) {
          return line;
        }

        let output = this.owoify(str);
        output = this.trimToSafeLength(output.split('\r\n').join(' '), currentIdxMeta);

        const lastLineLength = output.split('\r\n');
        currentIdxMeta.NODlength = lastLineLength;

        if ([ '<CLR', '<CLO' ].includes(TSCtag)) {
          currentIdxMeta.NODlength = 0;
        }

        if (TSCtag === '<CLO') {
          currentIdxMeta = {
            NODlength: 0,
            isFace: false
          };
        }

        return `${TSCtag}${output}`;
      })
      .join('');
  }
}

module.exports.Script = Script;
