import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ContentChange } from 'ngx-quill';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';


Quill.register('modules/blotFormatter', BlotFormatter)

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: []
})
export class CreateComponent implements OnInit {

  templateForm: FormGroup;
  quillEditorModules = {};

  constructor() { 
    this.templateForm = new FormGroup({
      textEditor: new FormControl(""),
      title: new FormControl(""),
    });
    this.quillEditorModules = {
      blotFormatter: {}
    };
  }

  ngOnInit(): void {
  }

  handleContentChange($event: ContentChange) {
    console.log($event);
  }

}
