odoo.define('clockpicker.clockpicker', function (require) {
    "use strict";

    var registry = require('web.field_registry');
    var AbstractField = require('web.AbstractField');

    var ClockTimePicker = AbstractField.extend({
        template: 'OdooClockPicker',
        supportedFieldTypes: ['char'],

        events: {
           'change input': function(){
                var selected_time = this.$('.clockpicker_val').val();
                this._setValue(selected_time);
           },
        },

        init: function (field_manager) {
            var self = this;
            this._super.apply(this, arguments);
            this.set("value", "");
            this.$input = this.$('input.clockpicker');
            this.defaultOptions = {
                twelvehour: true,
                donetext: 'Done',
                //autoclose: true,
                afterDone: function(){
                     self.$('input').trigger("change");
                },
            }
        },

        start: function() {
            this.$input.focus(function(e) {
                e.stopImmediatePropagation();
            });
            if (this.mode !== 'readonly'){
                this.$('input').clockpicker(this.defaultOptions)
            }
            this.render_value();
            return this._super();
        },

        isSet: function () {
           return true;
        },

        _reset: function () {
            this._super.apply(this, arguments);
            if (this.mode !== 'readonly'){
                this.$('input').clockpicker(this.defaultOptions);
            }
            this.render_value();
        },

        // Displaying Values While Loading
        render_value: function () {
            if(this.value){
                if(this.mode === 'readonly'){
                    this.$('.oe_field_content').text(this.value);
                }else{
                    this.$('input.clockpicker_val').val(this.value);
                }
            }else{
                this.$('.oe_field_content').text('');
            }
        },

        // Need to trigger this function - For Updating Selected Values in Database
        _setValue: function(value, options){
            var def = $.Deferred();
            var changes = {};
            changes[this.name] = value;
            this.trigger_up('field_changed', {
                dataPointID: this.dataPointID,
                changes: changes,
                viewType: this.viewType,
                doNotSetDirty: options && options.doNotSetDirty,
                notifyChange: !options || options.notifyChange !== false,
                onSuccess: def.resolve.bind(def),
                onFailure: def.reject.bind(def),
            });
            return def;
        },
    });
registry.add('o_clockpicker', ClockTimePicker);
return ClockTimePicker;
});
