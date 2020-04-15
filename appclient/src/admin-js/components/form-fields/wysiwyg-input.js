import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react';

export default class WysiwygInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
            .wysiwyg-field
                label(
                    for=this.props.id,
                    key='label-'+this.props.id)=this.props.id.replace(/_/gi," ")
                Editor(
                    apiKey="yvvdq4afypg7y3n6bvatekrux9lguy6pbzcrim69bt6kv271",
                    key=this.props.id,
                    id=this.props.id,
                    name=this.props.id,
                    initialValue=this.props.value
                    onEditorChange=this.props.handleChange
            )
`
    }
}