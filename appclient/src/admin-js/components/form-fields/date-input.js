import React from 'react';
import DatePicker from "react-datepicker";

class DateInput extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            .datepicker-field(key=this.props.id)
                label(
                    key='label-'+this.props.id,
                    for=this.props.id
                    )=this.props.label
                DatePicker(
                    key='datefield-'+this.props.id,
                    selected=this.props.selected,
                    value=this.props.value,
                    onChange=this.props.onChange,
                    data-parent=this.props.parent
                    )`
    }
}
module.exports = DateInput;