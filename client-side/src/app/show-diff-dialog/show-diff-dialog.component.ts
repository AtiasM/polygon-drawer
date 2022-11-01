import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxObjectDiffService } from 'ngx-object-diff';


@Component({
  selector: 'app-show-diff-dialog',
  templateUrl: './show-diff-dialog.component.html',
  styleUrls: ['./show-diff-dialog.component.scss']
})
export class ShowDiffDialogComponent implements OnInit {
  previous: any
  current: any
  diffView: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public incoming: any,
    private objectDiff: NgxObjectDiffService,
    private dialogRef: MatDialogRef<ShowDiffDialogComponent>) { }

  ngOnInit(): void {
    this.previous = this.objectDiff.objToJsonView(this.incoming.prev)
    this.current = this.objectDiff.objToJsonView(this.incoming.curr)
  }
  onCloseButtonClicked(){
    this.dialogRef.close()
  }

}
