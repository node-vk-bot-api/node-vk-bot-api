class Markup {
  static keyboard(buttons) {
    this.__keyboard = {
      buttons: Array.isArray(buttons[0])
        ? buttons
        : [buttons.map(label => Markup.button(label))],
    };

    return this;
  }

  static oneTime(value = true) {
    this.__keyboard.one_time = value;

    return this;
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

  static toJSON() {
    return JSON.stringify(this.__keyboard);
  }
}

module.exports = Markup;
