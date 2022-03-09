class WarningBeforeUnload {
    constructor(options = {}) {
        this.selector = options.selector || 'form';
        this.form = options.form || document.querySelector(this.selector);
        this.onInput = options.onInput || false;
        
        this.onSubmit = options.onSubmit || function() {
            this.form.addEventListener('submit', () => this.preventUnload = false);
        };
        
        if(this.form) {
            Array.from(this.form).forEach(item => item.dataset.prevalue = this.prevalue(item));
            this.onInput ? this.form.addEventListener('input', () => this.addBeforeUnload()) : this.addBeforeUnload();
            this.preventUnload = true;
            this.onSubmit();
        } else {
            throw 'WarningBeforeUnload: Form not found';
        }
    }

    prevalue(item) {
        return ['checkbox', 'radio'].includes(item.type) ? (item.checked ? 1 : 0) : item.value;
    }

    getFormState(event) {
        if(this.preventUnload) {
            Array.from(this.form).forEach(item => {
                typeof item.dataset.prevalue == 'undefined' || item.dataset.prevalue != this.prevalue(item) ? event.preventDefault() : true;
            });
        }
    }

    addBeforeUnload() {
        addEventListener('beforeunload', event => this.getFormState(event), { capture: true });
    }
}