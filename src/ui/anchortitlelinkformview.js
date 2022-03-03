import {
  ButtonView,
  FocusCycler,
  LabeledFieldView,
  View,
  ViewCollection,
  createLabeledInputText,
  injectCssTransitionDisabler,
  submitHandler,
} from 'ckeditor5/src/ui';
import { FocusTracker, KeystrokeHandler } from 'ckeditor5/src/utils';
import { icons } from 'ckeditor5/src/core';

// See: #8833.
// eslint-disable-next-line ckeditor5-rules/ckeditor-imports
import '@ckeditor/ckeditor5-ui/theme/components/responsive-form/responsiveform.css';
import '../../theme/linkform.css';

export default class AnchorTitleLinkFormView extends View {
  constructor(locale) {
    super(locale);

    const t = locale.t;

    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();
    this.titleInputView = this.createTitleInput();
    this.saveButtonView = this.createButton(t('Save'), icons.check, 'ck-button-save');
    this.saveButtonView.type = 'submit';
    this.cancelButtonView = this.createButton(
      t('Cancel'),
      icons.cancel,
      'ck-button-cancel',
      'cancel',
    );
    this.children = this.createFormChildren();
    this._focusables = new ViewCollection();

    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        focusPrevious: 'shift + tab',
        focusNext: 'tab',
      },
    });

    const classList = ['ck', 'ck-link-form', 'ck-responsive-form'];

    this.setTemplate({
      tag: 'form',

      attributes: {
        class: classList,
        tabindex: '-1',
      },

      children: this.children,
    });

    injectCssTransitionDisabler(this);
  }

  render() {
    super.render();

    submitHandler({
      view: this,
    });

    const childViews = [
      this.titleInputView,
      this.saveButtonView,
      this.cancelButtonView,
    ];

    childViews.forEach((v) => {
      this._focusables.add(v);
      this.focusTracker.add(v.element);
    });

    this.keystrokes.listenTo(this.element);
  }

  destroy() {
    super.destroy();

    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }

  focus() {
    this._focusCycler.focusFirst();
  }

  createTitleInput() {
    const t = this.locale.t;
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);

    labeledInput.label = t("Anchor's title");

    return labeledInput;
  }

  createButton(label, icon, className, eventName) {
    const button = new ButtonView(this.locale);

    button.set({
      label,
      icon,
      tooltip: true,
    });

    button.extendTemplate({
      attributes: {
        class: className,
      },
    });

    if (eventName) {
      button.delegate('execute').to(this, eventName);
    }

    return button;
  }

  createFormChildren() {
    const children = this.createCollection();

    children.add(this.titleInputView);
    children.add(this.saveButtonView);
    children.add(this.cancelButtonView);

    return children;
  }
}
