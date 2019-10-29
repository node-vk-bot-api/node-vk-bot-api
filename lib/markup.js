const KEYBOARD_COLUMNS_MAX = 4;

class Markup {
  keyboard(buttons, options = { columns: KEYBOARD_COLUMNS_MAX }) {
    this.__keyboard = {
      buttons: Array.isArray(buttons[0])
        ? buttons
        : buttons.reduce((array, label) => {
          const button = Markup.button(label);
          const buttons = array.length ? array[array.length - 1] : array[0];

          if (buttons && buttons.length < options.columns) {
            buttons.push(button);
          } else {
            array.push([button]);
          }

          return array;
        }, []),
    };

    return this;
  }

  oneTime(value = true) {
    this.__keyboard.one_time = value;

    return this;
  }

  inline(value = true) {
    this.__keyboard.inline = value;

    return this;
  }

  toJSON() {
    return JSON.stringify(this.__keyboard);
  }

  static keyboard(keyboard, options) {
    return new Markup().keyboard(keyboard, options);
  }

  static button(label, color = 'default', payload = { button: label }) {
    if (typeof label === 'object') {
      return label;
    }

    return {
      action: {
        type: 'text',
        payload: JSON.stringify(payload),
        label,
      },
      color,
    };
  }
}

module.exports = Markup;
